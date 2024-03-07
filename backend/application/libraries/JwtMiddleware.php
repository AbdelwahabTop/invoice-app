<?php
require __DIR__ . '/jwt/autoload.php';
// require __DIR__ . '/vendor/autoload.php';


use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// fire base from vender google firebase

class JwtMiddleware
{

    private $secret_key;

    public function __construct()
    {
        $this->secret_key = '@@redhaalasd2020@@';
        // load model
        $this->CI = &get_instance();
        $this->CI->load->model('NotificationModel');
        $this->CI->load->model('UserModel');

    }

    public function encode($data, $expir = "11900")
    {
        $iat = time();
        $exp = $iat + $expir;
        $data["iat"] = $iat;
        $data["exp"] = $exp;
        $payload = $data;
        $jwt = JWT::encode($payload, $this->secret_key, 'HS256');
        return $jwt;
    }

    public function decode($token, $type = "normal")
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key, 'HS256'));
            $decoded_array = (array) $decoded;
            $exp = $decoded_array["exp"];
            $iat = time();
            if ($exp > $iat || $type == "logout")
                return $decoded_array;
            else
                return 0;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function createHash()
    {
        // hash == 16 number
        $hash = rand(1000000000000000, 9999999999999999);
        return $hash;
    }


    public function sendNot($title, $data, $token, $message)
    {
        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => "https://fcm.googleapis.com/fcm/send",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "{\r\n    \"notification\": {\r\n        \"body\": \"$message\",\r\n        \"title\": \"$title\",\r\n        \"sound\": \"default\"\r\n    },\r\n    \"data\": $data,\r\n    \"priority\": \"high\",\r\n    \"to\": \"$token\"\r\n}",
                CURLOPT_HTTPHEADER => array(
                    "authorization: key=AAAAovaiYwE:APA91bEKfehNrI4fdMRaObWfJqshVRdIPzWlJpzoJN1EC3XG3Ax0Mf8fHBQJ5ps83FbkSgj7BaMs7UTmgOuar8pJNDwbFg-hYuycKzGz-k3UKb0422cmOtmDCDdxmLHDENTxk6gGy4dv",
                    "cache-control: no-cache",
                    "content-type: application/json",
                    "postman-token: 3c0e79f3-97eb-0024-022c-7adb8d94e7e5"
                ),
            )
        );
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            echo false;
        } else {
            return true;
        }
    }

    public function insertNotToFirebase($data)
    {
        $type = $data["type"];
        $user_hash = $data["user"];
        $user_name = $this->CI->UserModel->getUserName($user_hash);
        $title = "";
        $text = "";
        switch ($type) {
            case 'task':
                $receiver = $data["receiver"];
                $receiver_name = $this->CI->UserModel->getUserName($receiver);
                $status = $data["status"];
                switch ($status) {
                    case 'create':
                        $title = "واجب جديد";
                        $text = "قام $user_name باسناد واجب جديد الى $receiver_name";
                        break;
                    case 'status':
                        $status_title = $data["status_title"];
                        $title = "تغير حالة واجب";
                        if ($receiver_name == $user_name)
                            $text = "قام $user_name بتغير حالة الواجب الخاص به الى $status_title";
                        else
                            $text = "قام $user_name بتغير حالة الواجب الخاص ب $receiver_name الى $status_title";
                        break;
                    case 'emergency':
                        $emergency = $data["emergency"];
                        if ($emergency == "1") {
                            $title = "واجب ذو اولوية";
                            $text = "قام $user_name بتحويل الواجب الخاص ب $receiver_name الى واجب ذو اولوية";
                        } else {
                            $title = "واجب غير مستعجل";
                            $text = "قام $user_name بتحويل الواجب الخاص ب $receiver_name الى واجب غير مستعجل";
                        }
                    case 'accept':
                        $isaccept = $data["isaccept"];
                        if ($isaccept == "1") {
                            $title = "قبول واجب";
                            $text = "قام $user_name بقبول الواجب الخاص ب $receiver_name";
                        } else {
                            $title = "رفض واجب";
                            $text = "قام $user_name برفض الواجب الخاص ب $receiver_name";
                        }
                        break;
                    case 'receiver':
                        $title = "تغير مسؤول الواجب";
                        $text = "قام $user_name بتغير مسؤول الواجب الخاص به الى $receiver_name";
                        break;
                    default:
                        // code...
                        break;
                }
                break;
            case 'fingerPrint':
                $status = $data["status"];
                $title = "تسجيل بصمة";
                if ($status == "in")
                    $text = "قام $user_name بعمل بصمة دخول";
                else
                    $text = "قام $user_name بعمل بصمة خروج";
                break;
            case 'check_in':
                $title = "تسجيل موقع";
                $note = $data["note"];
                $text = "قام $user_name بتسجيل موقعه بملاحظة $note";
                break;
            case 'vacation':
                $status = $data["status"];
                $receiver = $data["receiver"];
                $receiver_name = $this->CI->UserModel->getUserName($receiver);
                switch ($status) {
                    case 'request':
                        $title = "طلب اجازه";
                        $text = "قام $user_name بطلب اجازه من $receiver_name";
                        break;
                    case '111':
                        $title = "تمت الموافقة علي اجازة";
                        $text = "تمت الموافقة علي اجازة $receiver_name من قبل $user_name";
                        break;
                    case '222':
                        $title = "تم رفض اجازة";
                        $text = "تم رفض اجازة $receiver_name من قبل $user_name";
                        break;
                    case '333':
                        $title = "تم تمرير اجازة";
                        $text = "تم تمرير اجازة الي $receiver_name من قبل $user_name";
                        break;
                    default:
                        break;
                }
            case 'advance':
                $status = $data["status"];
                $receiver = $data["receiver"];
                $receiver_name = $this->CI->UserModel->getUserName($receiver);
                switch ($status) {
                    case 'request':
                        $title = "طلب سلفه";
                        $text = "قام $user_name بطلب سلفه من $receiver_name";
                        break;
                    case '1':
                        $title = "تمت الموافقة على سلفة";
                        $text = "تمت الموافقة على سلفة $receiver_name من قبل $user_name";
                        break;
                    case '2':
                        $title = "تم رفض سلفة";
                        $text = "تم رفض سلفة $receiver_name من قبل $user_name";
                        break;
                    case '3':
                        $title = "تم تمرير سلفة";
                        $text = "تم تمرير سلفة الى $receiver_name من قبل $user_name";
                        break;
                    default:
                        break;
                }
                break;
            default:
                # code...
                break;
        }
        $curl = curl_init();
        if ($text != "" && $title != "") {
            $this->CI->NotificationModel->createNotification($title, $type, $text, $user_hash);
            $post_fields = [
                "key" => "rN9yNrQ7AUNys9mEsi0YLYuLIsaVSmJJvGzl7PMA",
                "secret" => "hcRnzwTKoBLGri6AJS7TQLXVT65GChiY",
                "roomId" => "mosalah",
                "message" => ["type" => $type]
            ];
            curl_setopt_array(
                $curl,
                array(
                    CURLOPT_URL => "https://s9272.fra1.piesocket.com/api/publish",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_CUSTOMREQUEST => "POST",
                    CURLOPT_POSTFIELDS => json_encode($post_fields),
                    CURLOPT_HTTPHEADER => array(
                        "Content-Type: application/json"
                    ),
                )
            );

            $response = curl_exec($curl);
            return $response;
        } else {
            return 0;
        }

    }
}