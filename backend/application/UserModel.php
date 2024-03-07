<?php
class UserModel extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        // load Middleware
        $this->load->library('TokenMiddleware');
    }

    public function getUserName($hash)
    {
        $this->db->select('name');
        $this->db->from('system_users');
        $this->db->where('hash', $hash);
        $query = $this->db->get();
        // return username
        return $query->row_array()['name'];
    }

    public function getMobileToken($hash)
    {
        $this->db->select('mobile_token');
        $this->db->from('system_users');
        $this->db->where('hash', $hash);
        $query = $this->db->get();
        // return token
        return $query->row_array()['mobile_token'];
    }


    public function updateMobileToken($username, $password, $token)
    {
        $this->db->set('mobile_token', $token);
        $this->db->where('username', $username);
        $this->db->where('password', $password);
        $this->db->update('system_users');
        return $this->db->affected_rows();
    }

    public function getUser($username, $password)
    {
        $this->db->select('username,user_type,hash,name,image_profile,mobile_token,partment,vication_agreement');
        $this->db->select("
            case 
                when user_type = '9876533' then 1
                else 0
            end as is_admin
        ");
        $this->db->from('system_users');
        // inner join
        $this->db->join('emp_information', 'system_users.hash=emp_information.user_hash');
        $this->db->where('username', $username);
        $this->db->where('password', $password);
        $query = $this->db->get();
        return $query->row_array();
    }

    public function checkPermission()
    {
        $access = true;
        $token = $this->tokenmiddleware->main();
        $user_hash = $this->tokenmiddleware->checkToken($token)['hash'];

        $headers = apache_request_headers();
        try {
            // check if headers has location
            if (!isset($headers['location'])) {
                $access = true;
                return true;
            }
            $location = $headers['location'];
            $page = $this->db->query("SELECT id FROM pages WHERE location = '" . $location . "'")->row_array()['id'];
            if (!$page) {
                // insert page
                $this->db->query("INSERT INTO pages (name,location) VALUES ('" . $location . "','" . $location . "')");
            }
            $page_id = $this->db->query("SELECT id FROM pages WHERE location = '" . $location . "'")->row_array()['id'];
            // check if user has permission
            $permission = $this->db->query("SELECT access FROM permission WHERE user_hash = '" . $user_hash . "' and page_id = '" . $page_id . "'")->row_array();
            if (!$permission) {
                // insert permission
                $this->db->query("INSERT INTO permission (access,user_hash,page_id) VALUES ('0','" . $user_hash . "','" . $page_id . "')");
                $access = false;
            } else {
                if ($permission['access'] == 0) {
                    $access = false;
                }
            }
        } catch (Exception $e) {
            $access = true;
        }
        if ($access) {
            return true;
        } else {
            echo json_encode(
                array(
                    'status' => 403,
                    'message' => 'ليس لديك صلاحية للدخول لهذه الصفحة',
                    'data' => null,
                    'isAuth' => true,
                    'action' => true,
                    'needPermission' => true,
                ),
                JSON_UNESCAPED_UNICODE
            );
            exit();
        }
    }

    public function updateUserPermission($user_hash, $data)
    {
        // loop through data
        foreach ($data as $key => $value) {
            // check if row exist
            $row = $this->db->query("SELECT id FROM permission WHERE user_hash = '" . $user_hash . "' and page_id = '" . $key . "'")->row_array();
            if (!$row) {
                // insert permission
                $this->db->query("INSERT INTO permission (access,user_hash,page_id) VALUES ('" . $value . "','" . $user_hash . "','" . $key . "')");
            } else {
                // update permission
                $this->db->query("UPDATE permission SET access = '" . $value . "' WHERE user_hash = '" . $user_hash . "' and page_id = '" . $key . "'");
            }
        }
        return true;
    }

    public function getUserPermission($user_hash)
    {
        $this->db->select('id,page_id,access');
        $this->db->from('permission');
        $this->db->where('user_hash', $user_hash);
        $query = $this->db->get();
        $userPermission = $query->result_array();
        $allPermission = $this->db->query("SELECT id,name, category FROM pages")->result_array();

        $data = [];
        foreach ($allPermission as $key => $value) {
            $data[$value['id']]['name'] = $value['name'];
            $data[$value['id']]['category'] = $value['category'];
            $data[$value['id']]['access'] = 0;
            $data[$value['id']]['id'] = $value['id'];

        }
        foreach ($userPermission as $key => $value) {
            $data[$value['page_id']]['access'] = $value['access'];
        }
        return $data;
    }

    public function getUserActivePermission($user_hash)
    {
        $pages = $this->db->query("SELECT location FROM permission INNER JOIN pages ON permission.page_id = pages.id WHERE user_hash = '" . $user_hash . "' and access = '1'")->result_array();
        $data = [];
        foreach ($pages as $key => $value) {
            array_push($data, $value['location']);
        }
        return $data;
    }

    public function summary($user_hash)
    {
        $queries = [
            "tasks_uncompleted" => "SELECT  * FROM task WHERE receiver = '" . $user_hash . "' AND status = '111' ORDER BY id DESC LIMIT 3",
            "emergency_tasks" => "SELECT * FROM task WHERE emergency = '1' AND receiver = '" . $user_hash . "' ORDER BY id DESC LIMIT 3",
            "overdue_tasks" => "SELECT * FROM task WHERE CURDATE() > DATE(deadline) AND receiver = '" . $user_hash . "' AND status = '111' ORDER BY id DESC LIMIT 3",
            "completed_task_count" => "SELECT COUNT(id) AS complete_task FROM task WHERE MONTH(CURDATE()) = MONTH(DATE(deadline)) AND receiver = '" . $user_hash . "' AND status = '222'",
            "incomplete_task_count" => "SELECT COUNT(id) AS not_complete_task FROM task WHERE MONTH(CURDATE()) = MONTH(DATE(deadline)) AND receiver = '" . $user_hash . "' AND status = '111'",
            "arrive_time" => "SELECT IFNULL(TIME_FORMAT(TIME(fingerprint_time),'%r'),'Ù„Ø§ØªÙˆØ¬Ø¯ Ø¨ØµÙ…Ø© Ù„Ù‡Ø°Ø§ Ø§Ù„ÙŠÙˆÙ…') AS arrive_time FROM emp_fingerprint WHERE DATE(fingerprint_time) = CURDATE() AND user_hash='" . $user_hash . "' AND in_out='in'",
            "out_time" => "SELECT IFNULL(TIME_FORMAT(TIME(fingerprint_time),'%r'),'Ù„Ø§ØªÙˆØ¬Ø¯ Ø¨ØµÙ…Ø© Ù„Ù‡Ø°Ø§ Ø§Ù„ÙŠÙˆÙ…') AS out_time FROM emp_fingerprint WHERE DATE(fingerprint_time) = CURDATE() AND user_hash='" . $user_hash . "' AND in_out='out'",
            "normal_vacation_month" => "SELECT get_vacations_current_month('222','" . $user_hash . "')*8 AS normal_vacation_month, hour_day FROM vacations_type LIMIT 1",
            "normal_vacation_year" => "SELECT get_vacations_current_year('222','" . $user_hash . "')*8 AS normal_vacation_year, hour_day FROM vacations_type LIMIT 1",
            "half_vacation_month" => "SELECT get_vacations_current_month('333','" . $user_hash . "') AS half_vacation_month, hour_day FROM vacations_type LIMIT 1",
            "half_vacation_year" => "SELECT get_vacations_current_year('333','" . $user_hash . "') AS half_vacation_year, hour_day FROM vacations_type LIMIT 1",
            "balance_vacations_month" => "SELECT (CEIL((vacations_limit/12))*8-get_vacations_current_month('222',user_hash)*8-get_vacations_current_month('333',user_hash)) AS balance_vacations_month FROM emp_information WHERE user_hash='" . $user_hash . "'",
            "balance_vacations_year" => "SELECT (vacations_limit*8-get_vacations_current_year('222',user_hash)*8-get_vacations_current_year('333',user_hash)) AS balance_vacations_year FROM emp_information WHERE user_hash='" . $user_hash . "'",
            "work_in_check_distance" => "SELECT work_in_check_distance, work_out_check_distance FROM emp_information WHERE user_hash='" . $user_hash . "'"
        ];

        $results = [];
        foreach ($queries as $resultName => $query) {
            $result = $this->db->query($query);
            // $results[$resultName] in ['tasks_completed', 'emergency_tasks', 'overdue_tasks']
            if (in_array($resultName, ['tasks_uncompleted', 'emergency_tasks', 'overdue_tasks'])) {
                $results[$resultName] = $result->result_array();
            } else {
                if ($resultName == 'arrive_time') {
                    $results[$resultName] = $result->row_array()['arrive_time'] ?? 'لم يتم تسجيل الحضور';
                } else if ($resultName == 'out_time') {
                    $results[$resultName] = $result->row_array()['out_time'] ?? 'لم يتم تسجيل الانصراف';
                } else {
                    $results[$resultName] = $result->row_array();
                }
            }
        }

        return $results;
    }

    public function getVacationsSummary($hash)
    {
        $query = $this->db->query("
            SELECT
                (get_vacations_current_month('222', '$hash') * 8) AS normal_vacation_month,
                hour_day AS normal_vacation_hour_day
            FROM
                vacations_type
            LIMIT 1;

            SELECT
                (get_vacations_current_year('222', '$hash') * 8) AS normal_vacation_year,
                hour_day AS normal_vacation_hour_day
            FROM
                vacations_type
            LIMIT 1;

            SELECT
                get_vacations_current_month('333', '$hash') AS half_vacation_month,
                hour_day AS half_vacation_hour_day
            FROM
                vacations_type
            LIMIT 1;

            SELECT
                get_vacations_current_year('333', '$hash') AS half_vacation_year,
                hour_day AS half_vacation_hour_day
            FROM
                vacations_type
            LIMIT 1;

            SELECT
                (CEIL((vacations_limit / 12)) * 8 - get_vacations_current_month('222', user_hash) * 8 - get_vacations_current_month('333', user_hash)) AS balance_vacations_month
            FROM
                emp_information
            WHERE
                user_hash = '$hash';

            SELECT
                (vacations_limit * 8 - get_vacations_current_year('222', user_hash) * 8 - get_vacations_current_year('333', user_hash)) AS balance_vacations_year
            FROM
                emp_information
            WHERE
                user_hash = '$hash';
    ");

        return $query->row_array();
    }

    public function fingerPrint($hash, $x, $y, $type, $mobileInfo)
    {

        // check if user is print before
        $this->checkIfPrint($hash, $type);
        // check if user is in office distance
        //$check = $this->checkDistanceAllowed($hash, $type);
        //$check = filter_var($check, FILTER_VALIDATE_BOOLEAN);
        //if ($check) {
        //    $this->checkDistance($hash, $x, $y);
        // }
        // random new hash from 16 char nad is int
        $new_hash = rand(1000000000000000, 9999999999999999);
        // mobile info
        $this->checkMobileInfo($hash, $mobileInfo);
        $query = $this->db->query(
            "
            insert into 
                emp_fingerprint(user_hash,fingerprint_type,in_out,location,mobile_info,hash) 
                values('$hash','111','$type',POINT('$x', '$y'),'$mobileInfo','$new_hash')
            "
        );
    }

    public function checkMobileInfo($userHash, $mobileInfo)
    {
        // get mobile info from system_users
        $query = $this->db->query(
            "
            select 
                mobile_info 
            from 
                system_users 
            where 
                hash='$userHash'
            limit 1;
            "
        );
        $mobile = $query->row_array()['mobile_info'];
        // if null set mobile info
        $query = $this->db->query(
            "
            update 
                system_users 
            set 
                mobile_info='$mobileInfo' 
            where 
                hash='$userHash'
            limit 1;
            "
        );
    }

    public function checkDistance($hash, $x, $y)
    {

        $query = $this->db->query(
            "
            select 
                round(st_distance_sphere(location, POINT('$x', '$y'))) as distance_from_location,
                allow_merters 
            from 
                office_to_user 
            inner join  
                office_location on office_to_user.office_hash=office_location.hash 
            where 
                office_to_user.user_hash='$hash'
            ORDER BY 
                distance_from_location ASC 
            LIMIT 1;
            "
        );
        $result = $query->row_array();

        if (isset($result['distance_from_location']) && isset($result['allow_merters'])) {
            if ($result['distance_from_location'] > $result['allow_merters']) {
                echo json_encode(
                    array(
                        'status' => 400,
                        'message' => 'لقد تجاوزت المسافة المسموح بها',
                        'data' => null,
                        'isAuth' => true
                    ),
                    JSON_UNESCAPED_UNICODE
                );
                exit();
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    public function checkIfPrint($hash, $type)
    {
        $query = $this->db->query(
            "
            select check_in_fingerprint('$hash','in') as count;
            "
        );
        $result = $query->row_array();
        $queryOut = $this->db->query(
            "
            select check_in_fingerprint('$hash','out') as count;
            "
        );
        $resultOut = $queryOut->row_array();
        if ($type == "out" && $result['count'] == 0) {
            echo json_encode(
                array(
                    'status' => 400,
                    'message' => 'لم تقم بتسجيل بصمة الدخول',
                    'data' => null,
                    'isAuth' => true
                ),
                JSON_UNESCAPED_UNICODE
            );
            exit();
        } else if ($type == "out" && $resultOut['count'] > 0) {
            echo json_encode(
                array(
                    'status' => 400,
                    'message' => 'لقد قمت بتسجيل البصمة مسبقا',
                    'data' => null,
                    'isAuth' => true
                ),
                JSON_UNESCAPED_UNICODE
            );
            exit();
        } else if ($type == "in" && $result['count'] > 0) {
            echo json_encode(
                array(
                    'status' => 400,
                    'message' => 'لقد قمت بتسجيل البصمة مسبقا',
                    'data' => null,
                    'isAuth' => true
                ),
                JSON_UNESCAPED_UNICODE
            );
            exit();
        } else {
            return true;
        }
    }

    public function checkDistanceAllowed($hash, $type)
    {
        if ($type == "in") {
            $query = "select work_in_check_distance as allow from emp_information where user_hash='$hash'";
        } else if ($type == "out") {
            $query = "select work_out_check_distance as allow from emp_information where user_hash='$hash'";
        }
        $query = $this->db->query($query);
        $result = $query->row_array();
        return $result['allow'];
    }


    public function updateProfile($data, $hash)
    {
        $this->db->set('name', $data['name']);
        $this->db->set('username', $data['username']);
        $this->db->set('password', $data['password']);
        // $this->db->set('image_profile', $data['image_profile']);
        $this->db->where('hash', $hash);
        $this->db->update('system_users');
        return $this->db->affected_rows();
    }
}