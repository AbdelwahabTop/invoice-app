public function getEmployees()
{
// Using $this->input->get() instead of direct access to headers
$isWork = $this->input->get('iswork');
$department = $this->input->get('department') ?? '';
$page = $this->input->get('page') ?? '1';
$perPage = $this->input->get('perPage') ?? '10';

        if (!isset($isWork) || $isWork !== '2') {
            $isWork = '2';
        } else {
            $isWork = '1';
        }

        $search = $this->input->get('q') ?? '';
        $offset = ($page - 1) * $perPage;

        $this->db->select('system_users.name,username,employment_code,password,image_profile,(select name from system_group_name where system_group_name.hash=system_users.user_type) as jop,emp_id as id,(select name from partments where partments.hash=emp_information.partment) as partment, (select Name from Positions where Positions.ID=emp_information.position) as position ,emp_information.partment as part_hash,jop_type,user_type,system_users.hash');
        $this->db->select('(SELECT GROUP_CONCAT(office_hash) as office_array FROM office_to_user WHERE user_hash = system_users.hash) as location_of_work');
        $this->db->select("vication_agreement,task_agreement,work_in_check_distance,work_out_check_distance, advance_agreement, advance_request");
        $this->db->select("emp_information.is_work");
        $this->db->from('system_users');

        // inner join
        $this->db->join('emp_information', 'system_users.hash=emp_information.user_hash');
        $this->db->join('partments', 'emp_information.partment = partments.hash', 'left');

        // where
        $this->db->where('emp_information.is_work !=', $isWork);

        // search
        if (isset($department) && $department != 'null' && $department != '') {
            $this->db->where('emp_information.position', $department);
        }

        if (isset($search) && $search != 'null' && $search != '') {
            $this->db->group_start();
            $this->db->like('system_users.name', $search);
            $this->db->or_like('username', $search);
            $this->db->group_end();
        }

        // order by
        // we will sort now by createdDate of user ASC (from old to new)
        $this->db->order_by('system_users.insert_record_date', 'asc');

        // $this->db->order_by('emp_information.partment');

        // limit
        $this->db->limit($perPage, $offset);

        $query = $this->db->get();
        return $query->result_array();
    }
