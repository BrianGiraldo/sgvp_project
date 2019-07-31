<?php

include("./custom_cruds/defualt_img_profile.php");


function db_LoginUser($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_email = $data["email"];
	$us_pass = $data["password"];
	$us_type = $data["type_u"];
	$additional_data = [];

	$SQL = "SELECT * FROM users WHERE us_email = '$us_email' AND us_type = '$us_type' ";
	$query_res = $db->query($SQL);

	if(!empty($query_res)){

		if($query_res[0]["us_pass"] == $us_pass){

			if($query_res[0]["us_state"] == 1){
				$token = db_GenerateToken($query_res[0]["us_id"]);
				$query_res2 = $token;
				$img = returnImg();
				if($query_res[0]["us_img"] && $query_res[0]["us_img"] != ''){
					$img = $query_res[0]["us_img"];
				}
				$additional_data = [
					'us_id' => $query_res[0]["us_id"],
					'us_email' => $query_res[0]["us_email"],
					'us_names' =>  $query_res[0]["us_names"],
					'us_lastnames' =>  $query_res[0]["us_lastnames"],
					'us_type' =>  $query_res[0]["us_type"],
					'us_img' =>  $img
					];
			}
			else{
				$query_res2 = 'account_disabled';
			}

		}
		else{
			$query_res2 = 'unauthorized';
		}
	}
	else{
		$query_res2 = 'unauthorized';
	}

	$us_id = $additional_data["us_id"];
	$us_type = $additional_data["us_type"];

	if(!empty($query_res))
	{
		if($us_type == 1){ //Estudiante
			$SQL = "SELECT * FROM student_info WHERE st_usersid = '$us_id'";
			$query_res = $db->query($SQL);
			$additional_data["st_idnumber"] =  $query_res[0]['st_idnumber'];
			$additional_data["st_career"] =  $query_res[0]['st_career'];
			$additional_data["st_isfree"] =  $query_res[0]['st_isfree'];
			$additional_data["st_teacherassc"] =  $query_res[0]['st_teacherassc'];
			$additional_data["st_celphone"] =  $query_res[0]['st_celphone'];
			$additional_data["st_phone"] =  $query_res[0]['st_phone'];
			$additional_data["st_address"] =  $query_res[0]['st_address'];
			$additional_data["st_schedule"] =  $query_res[0]['st_schedule'];
			$additional_data["st_hv"] =  $query_res[0]['st_hv'];
			$additional_data["st_cardid"] =  $query_res[0]['st_cardid'];
			$additional_data["st_eps"] =  $query_res[0]['st_eps'];
			$additional_data["st_enrollment"] =  $query_res[0]['st_enrollment'];
			$additional_data["st_practice"] =  $query_res[0]['st_practice'];
			$additional_data["st_agreement_practice"] =  $query_res[0]['st_agreement_practice'];
			$additional_data["st_acta_practice"] =  $query_res[0]['st_acta_practice'];
			$additional_data["st_informefinal_practice"] =  $query_res[0]['st_informefinal_practice'];

			$SQL2 = "SELECT stav_document FROM student_avance WHERE stav_student_id = '$us_id'";
			$query_res2 = $db->query($SQL2);
			$additional_data["avance_mensual"] = array_map("clean_stav_document", $query_res2);
			$SQL2 = "SELECT stseas_document FROM student_seguimiento_asesoria WHERE stseas_student_id = '$us_id'";
			$query_res2 = $db->query($SQL2);
			$additional_data["seguimiento_asesoria"] = array_map("clean_stseas_document", $query_res2);
		}
		if($us_type == 2){ //Empresa
			$SQL = "SELECT * FROM company_info WHERE comin_usersid = '$us_id'";
			$query_res = $db->query($SQL);
			$additional_data["comin_name"] =  $query_res[0]['comin_name'];
			$additional_data["comin_razon"] =  $query_res[0]['comin_razon'];
			$additional_data["comin_nit"] =  $query_res[0]['comin_nit'];
			$additional_data["comin_address"] =  $query_res[0]['comin_address'];
			$additional_data["comin_phone"] =  $query_res[0]['comin_phone'];
			$additional_data["comin_commerce"] =  $query_res[0]['comin_commerce'];
			$additional_data["comin_rut"] =  $query_res[0]['comin_rut'];
			$additional_data["comin_cardid"] =  $query_res[0]['comin_cardid'];
			$additional_data["comin_possesion"] =  $query_res[0]['comin_possesion'];
			$additional_data["comin_agreement"] =  $query_res[0]['comin_agreement'];
			$additional_data["comin_resolution"] =  $query_res[0]['comin_resolution'];
		}
	}

	return array('data' => $query_res2,'additional_data' => $additional_data);
}


function db_GenerateToken($us_id){

    $cadena = "abcdefghijklmnopqrstuvwxyz1234567890";
    $longitudCadena=strlen($cadena);
    $token = "";
    $longitudPass=128;
    for($i=1 ; $i<=$longitudPass ; $i++){
        $pos=rand(0,$longitudCadena-1);
        $token .= substr($cadena,$pos,1);
    }

    $db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$current_date = new DateTime();
    $current_date = $current_date->format('Y-m-d H:i:s');

	$SQL = "INSERT INTO users_tokens(ustk_us_id, ustk_token) VALUES ('$us_id','$token')";
	$SQL2 = "UPDATE users SET us_last_login = '$current_date' WHERE us_id = '$us_id'";

	try {
		$query_res = $db->query($SQL);
		$query_res2 = $db->query($SQL2);
		$data_response = ['ustk_us_id' => $us_id, 'ustk_token' => $token];
		return $data_response;
	} catch (Exception $e) {
		return 'error-token';
	}

}

function db_Auth($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_id = $data['us_id'];
	$token = $data['token'];
	$us_type = $data['us_type'];

	$SQL = "SELECT us_type FROM users WHERE us_id = '$us_id'";
	$query_res = $db->query($SQL);

	if(!empty($query_res))
	{
		if($query_res[0]['us_type'] != $us_type)
		{
			$data_logout = ['us_id' => $us_id, 'ustk_token' => $token];
			db_Logout($data_logout);
			return array('data' => 'unauthorized');
		}
	}


	$SQL = "SELECT ustk_us_id FROM users_tokens WHERE ustk_us_id = '$us_id' AND ustk_token = '$token' ";
	$query_res = $db->query($SQL);

	if(!empty($query_res))
	{
		return array('data' => 'authorized');
	}
	else
	{
		$SQL = "DELETE FROM users_tokens WHERE  ustk_token = '$token' ";
		$query_res = $db->query($SQL);
		return array('data' => 'unauthorized');
	}

}

//

function db_Forgot($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$email = $data['emailforgot'];

	$SQL = "SELECT US.us_id,US.us_names,US.us_lastnames FROM users AS US WHERE US.us_email = '$email' ";
   	$query_res = $db->query($SQL);

   	if(empty($query_res))
   	{

    	return array('data' => "no-exist");
   	}
   	else
   	{
   		$newPass = db_GeneratePassword();
   		$newPassSave = md5($newPass);
   		$SQL2 = "UPDATE users SET us_pass = '$newPassSave' WHERE us_email = '$email' ";
   		$query_res2 = $db->query($SQL2);
   		sendMail($email,$newPass,$query_res);
   		return array('data' => 'reset-password');
   	}


}


function db_NewCompany($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$email = $data['emailnew'];
	$pass = $data['passnew'];

	$SQL = "SELECT US.us_id FROM users AS US WHERE US.us_email = '$email' ";
   	$query_res = $db->query($SQL);

   	if(!empty($query_res))
   	{

    	return array('data' => "exist");
   	}
   	else
   	{
   		$newPassSave = md5($pass);
   		$SQL2 = "INSERT INTO users(us_email, us_pass,us_type) VALUES ('$email','$newPassSave', 2)";
   		$query_res2 = $db->query($SQL2);
   		$SQL = "SELECT * FROM users WHERE us_email = '$email' ";
		$query_res = $db->query($SQL);
		$token = db_GenerateToken($query_res[0]["us_id"]);
		$query_res2 = $token;
		//CREAR EN LA TABLA COMPANY INFO
		$us_id = $query_res[0]["us_id"];
   		$SQL3 = "INSERT INTO company_info(comin_usersid) VALUES ('$us_id')";
   		$query_res3 = $db->query($SQL3);
   		///
		$additional_data = [
			'us_id' => $query_res[0]["us_id"],
			'us_email' => $query_res[0]["us_email"],
			'us_type' =>  $query_res[0]["us_type"],
			'us_img' =>  $query_res[0]["us_img"]
			];
   		return array('data' => $query_res2,'additional_data' => $additional_data);
   	}


}

function db_Logout($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$us_id = $data['us_id'];
	$ustk_token = $data['ustk_token'];

	$SQL = "SELECT ustk_us_id FROM users_tokens WHERE ustk_us_id = '$us_id' AND ustk_token = '$ustk_token' ";
   	$query_res = $db->query($SQL);

   	if(empty($query_res))
   	{

    	return array('data' => "no-logout");
   	}
   	else
   	{


   		$SQL = "DELETE FROM users_tokens WHERE ustk_us_id = '$us_id' AND ustk_token = '$ustk_token' ";
		$query_res = $db->query($SQL);
   		return array('data' => 'logout-ok');
   	}


}

function db_ChangePassWord($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$passnew =  $data['passnew'];
	$passold =  $data['passold'];
	$us_id =  $data['us_id'];



	$SQL = "SELECT us_id FROM users WHERE us_id = '$us_id' AND us_pass = '$passold'";
   	$query_res = $db->query($SQL);

   	if(empty($query_res))
   	{

    	return array('data' => "oldpass-incorrect");
   	}
   	else
   	{


   		$SQL = "UPDATE users SET us_pass = '$passnew' WHERE us_id = '$us_id' ";
		$query_res = $db->query($SQL);
   		return array('data' => 'change-ok');
   	}


}

function db_ChangePhoto($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$base64Image =  $data['base64Image'];
	$us_id =  $data['us_id'];
	$SQL = "UPDATE users SET us_img = '$base64Image' WHERE us_id = '$us_id' ";
	$query_res = $db->query($SQL);
	if($query_res){
   		return array('data' => 'change-ok');
	} else {
		return array('data' => 'change-error');
	}
}



function db_NewUsers($data)
{

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);
	$decode_json = json_decode($data['param'], True);
	$message = ""; 

	for($i=0 ; $i<count($decode_json['data']) ; $i++){

        $us_email =  $decode_json['data'][$i]['email'];
		$us_pass =  $decode_json['data'][$i]['password'];
		$us_names =  $decode_json['data'][$i]['names'];
		$us_lastnames =  $decode_json['data'][$i]['lastnames'];
		$us_type = 1;
		$st_career =  $decode_json['data'][$i]['career'];

		$SQL = "SELECT us_id FROM users WHERE us_email = '$us_email' AND us_type = '$us_type' ";
		$query_res = $db->query($SQL);
		if(!empty($query_res))
		{
			$message = $message."El correo $us_email para el usuario $us_names $us_lastnames ya se encuentra registrado, ";
		}
		else
		{
			$SQL = "INSERT INTO users(us_email, us_pass, us_names, us_lastnames, us_type) VALUES ('$us_email','$us_pass','$us_names','$us_lastnames','$us_type')";
			$query_res = $db->query($SQL);
			if($us_type == 2){
				//CREAR EN LA TABLA COMPANY INFO
				$us_id = $query_res;
		   		$SQL3 = "INSERT INTO company_info(comin_usersid) VALUES ('$us_id')";
		   		$query_res3 = $db->query($SQL3);
	   			///
			}
			if($us_type == 1){
				//CREAR EN LA TABLA STUDENT INFO
				$us_id = $query_res;
		   		$SQL3 = "INSERT INTO student_info(st_usersid,st_career) VALUES ('$us_id','$st_career')";
		   		$query_res3 = $db->query($SQL3);
	   			///
			}
		}
    }
	return array('data' => $message);
}

function db_NewUser($data)
{

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_email =  $data['query']['email'];
	$us_pass =  $data['query']['pass'];
	$us_names =  $data['query']['names'];
	$us_lastnames =  $data['query']['lastnames'];
	$us_type =  $data['query']['us_type'];
	$st_career =  $data['query']['st_career'];

	$SQL = "SELECT us_id FROM users WHERE us_email = '$us_email' AND us_type = '$us_type' ";
	$query_res = $db->query($SQL);
	if(!empty($query_res))
	{
		return array('data' => 'user-exist');
	}
	else
	{
		$SQL = "INSERT INTO users(us_email, us_pass, us_names, us_lastnames, us_type) VALUES ('$us_email','$us_pass','$us_names','$us_lastnames','$us_type')";
		$query_res = $db->query($SQL);
		if($us_type == 2){
			//CREAR EN LA TABLA COMPANY INFO
			$us_id = $query_res;
	   		$SQL3 = "INSERT INTO company_info(comin_usersid) VALUES ('$us_id')";
	   		$query_res3 = $db->query($SQL3);
   			///
		}
		if($us_type == 1){
			//CREAR EN LA TABLA STUDENT INFO
			$us_id = $query_res;
	   		$SQL3 = "INSERT INTO student_info(st_usersid,st_career) VALUES ('$us_id','$st_career')";
	   		$query_res3 = $db->query($SQL3);
   			///
		}
		return array('data' => 'user-create');
	}
}


function db_NewOffer($data)
{

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_id =  $data['us_id'];
	$name =  $data['name'];
	$description =  $data['description'];
	$img =  $data['img'];

	$SQL = "INSERT INTO offers(name, description, img, company_id) VALUES ('$name','$description','$img','$us_id')";
	$query_res = $db->query($SQL);
	return array('data' => 'ok');
}


function db_DeleteOffer($data)
{

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$offer_id =  $data['offer_id'];

	$SQL = "DELETE FROM `offers` WHERE `offers`.`id` = $offer_id";
	$query_res = $db->query($SQL);
	return array('data' => 'ok');
}


function db_UpdateUser($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_id =  $data['us_id'];

	$us_email =  $data['us_email'];
	$us_names =  $data['us_names'];
	$us_lastnames =  $data['us_lastnames'];
	$us_type = $data['us_type'];

	$SQL = "UPDATE users SET us_email = '$us_email', us_names = '$us_names', us_lastnames = '$us_lastnames' WHERE us_id = '$us_id' ";
	$query_res = $db->query($SQL);
	$SQL3 = "";
	if($us_type == 1){ //Estudiante
		$st_idnumber =  $data['st_idnumber'];
		$st_career =  $data['st_career'];
		$st_isfree =  $data['st_isfree'];
		$st_teacherassc =  $data['st_teacherassc'];
		$st_celphone =  $data['st_celphone'];
		$st_phone =  $data['st_phone'];
		$st_address =  $data['st_address'];
		$st_schedule =  $data['st_schedule'];
   		$SQL3 = "UPDATE student_info SET st_idnumber = '$st_idnumber', st_career = '$st_career', st_isfree = $st_isfree, st_teacherassc = $st_teacherassc, st_celphone = '$st_celphone', st_phone = '$st_phone', st_address = '$st_address', st_schedule = '$st_schedule' WHERE  st_usersid = '$us_id'";
   		$query_res3 = $db->query($SQL3);
	}
	if($us_type == 2){ // Empresa 
		$comin_name =  $data['comin_name'];
		$comin_razon =  $data['comin_razon'];
		$comin_nit =  $data['comin_nit'];
		$comin_address =  $data['comin_address'];
		$comin_phone =  $data['comin_phone'];
   		$SQL3 = "UPDATE company_info SET comin_name = '$comin_name', comin_razon = '$comin_razon', comin_nit = '$comin_nit', comin_address = '$comin_address', comin_phone = '$comin_phone' WHERE  comin_usersid = '$us_id'";
   		$query_res3 = $db->query($SQL3);
	}
	return array('data' => "ok");
}


function db_GetUsers($data)
{

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_id =  $data['us_id'];
	$us_type =  $data['us_type'];
	$limit =  $data['limit'];
	$offset =  $data['offset'];
	$param =  json_decode($data['param'], true);

	if(isset($param) && isset($param['us_id']) && $param['us_id'] != '') {
		$us_id = $param['us_id'];
		$SQL = "SELECT COUNT(*) FROM users WHERE us_id = $us_id";
		$query_res = $db->query($SQL);
		if(empty($query_res) || $query_res[0]["COUNT(*)"] == 0)
		{
			return array('data' => '','data_length' => '');
		}
		else
		{

			$SQL2 = "SELECT
						US.us_id,
						US.us_email,
						US.us_names,
						US.us_lastnames,
						US.us_img,
						US.us_type,
						US.us_state,
						US.us_last_login,
						CI.comin_id,
						CI.comin_usersid,
						CI.comin_name,
						CI.comin_nit,
						CI.comin_address,
						CI.comin_phone,
						CI.comin_commerce,
						CI.comin_cardid,
						CI.comin_possesion,
						CI.comin_id,
						CI.comin_agreement,
						CI.comin_resolution,
						ST.st_id,
						ST.st_usersid,
						ST.st_idnumber,
						ST.st_career,
						ST.st_isfree,
						ST.st_teacherassc,
						ST.st_celphone,
						ST.st_phone,
						ST.st_address,
						ST.st_schedule,
						ST.st_hv,
						ST.st_cardid,
						ST.st_eps,
						ST.st_enrollment,
						ST.st_practice,
						PR.pro_name
						FROM users AS US
						LEFT JOIN company_info AS CI
						ON US.us_id = CI.comin_usersid
						LEFT JOIN student_info AS ST
						ON US.us_id = ST.st_usersid
						LEFT JOIN programs AS PR
						ON ST.st_career = PR.pro_id
						WHERE US.us_id = $us_id
						";

			$query_res2 = $db->query($SQL2);
			$data = $query_res2;
			return array('data' => $data,'data_length' => 1);
		}
	} else {
		$SQL2 = "SELECT
					US.us_id,
					US.us_email,
					US.us_names,
					US.us_lastnames,
					US.us_img,
					US.us_type,
					US.us_state,
					US.us_last_login,
					CI.comin_id,
					CI.comin_usersid,
					CI.comin_name,
					CI.comin_nit,
					CI.comin_address,
					CI.comin_phone,
					CI.comin_commerce,
					CI.comin_cardid,
					CI.comin_possesion,
					CI.comin_id,
					CI.comin_agreement,
					CI.comin_resolution,
					ST.st_id,
					ST.st_usersid,
					ST.st_idnumber,
					ST.st_career,
					ST.st_isfree,
					ST.st_teacherassc,
					ST.st_celphone,
					ST.st_phone,
					ST.st_address,
					ST.st_schedule,
					ST.st_hv,
					ST.st_cardid,
					ST.st_eps,
					ST.st_enrollment,
					ST.st_practice,
					PR.pro_name
					FROM users AS US
					LEFT JOIN company_info AS CI
					ON US.us_id = CI.comin_usersid
					LEFT JOIN student_info AS ST
					ON US.us_id = ST.st_usersid
					LEFT JOIN programs AS PR
					ON ST.st_career = PR.pro_id
					";

		$SQL = "SELECT COUNT(*) FROM users AS US
					LEFT JOIN company_info AS CI
					ON US.us_id = CI.comin_usersid
					LEFT JOIN student_info AS ST
					ON US.us_id = ST.st_usersid";

		if(isset($param['text']) && $param['text'] != '') //FILTRO POR CORREO CEDULA O NIT
		{
			if(strpos($SQL, 'WHERE')){
				$p = $param['text'];
				$SQL2 .= " AND (US.us_email LIKE '%$p%' OR ST.st_idnumber = '$p' OR  CI.comin_nit = '$p')";
				$SQL .= " AND (US.us_email LIKE '%$p%' OR ST.st_idnumber = '$p' OR  CI.comin_nit = '$p')";
			} else {
				$p = $param['text'];
				$SQL2 .= " WHERE (US.us_email LIKE '%$p%' OR ST.st_idnumber = '$p' OR  CI.comin_nit = '$p')";
				$SQL .= " WHERE (US.us_email LIKE '%$p%' OR ST.st_idnumber = '$p' OR  CI.comin_nit = '$p')";
			}
		}

		if(isset($param['rol']) && $param['rol'] != '') //FILTRO DE ROL
		{
			$r = $param['rol'];
			if($param['rol'] == "1" OR $param['rol'] == "2" OR $param['rol'] == "3" OR $param['rol'] == "4")
			{
				if(strpos($SQL, 'WHERE')){
					$SQL2 .= " AND US.us_type = '$r'";
					$SQL .= " AND US.us_type = '$r'";
				} else {
					$SQL2 .= " WHERE US.us_type = '$r'";
					$SQL .= " WHERE US.us_type = '$r'";
				}
			}
			else
			{
				if($param['rol'] == "5")
				{
					if(strpos($SQL, 'WHERE')){
						$SQL2 .= " AND ST.st_isfree = 1";
						$SQL .= " AND ST.st_isfree = 1";
					} else {
						$SQL2 .= " WHERE ST.st_isfree = 1";
						$SQL .= " WHERE ST.st_isfree = 1";
					}
				}
				else if($param['rol'] == "6")
				{
					if(strpos($SQL, 'WHERE')){
						$SQL2 .= " AND ST.st_isfree = '0'";
						$SQL .= " AND ST.st_isfree = '0'";
					} else {
						$SQL2 .= " WHERE ST.st_isfree = '0'";
						$SQL .= " WHERE ST.st_isfree = '0'";
					}
				}
			}
		}

		if(isset($param['docente']) && $param['docente'] != '') //FILTRO POR DOCENTE ASIGNADO
		{
			if(strpos($SQL, 'WHERE')){
				$p = $param['docente'];
				$SQL2 .= " AND ST.st_teacherassc = $p";
				$SQL .= " AND ST.st_teacherassc = $p";
			} else {
				$p = $param['docente'];
				$SQL2 .= " WHERE ST.st_teacherassc = $p";
				$SQL .= " WHERE ST.st_teacherassc = $p";
			}
		}

		$SQL2 .= " ORDER BY US.us_id DESC";

		if($limit)
		{
			$SQL2 .= " LIMIT $limit";
		}

		if($offset)
		{
			$SQL2 .= " OFFSET $offset";
		}

		//echo $SQL;
		$query_res = $db->query($SQL);
		//echo $SQL2;
		$query_res2 = $db->query($SQL2);
		if ($us_type == 4) {
			for ($count=0; $count < count($query_res2); $count++) {
				$SQL3 = "SELECT * FROM teacher_student_tracing WHERE tst_teacher_id = $us_id AND tst_student_id = ".strval($query_res2[$count]['us_id']);
				$query_res3 = $db->query($SQL3);
				if (isset($query_res3)) {
					$query_res2[$count]['tracing'] = $query_res3;
				} else {
					$query_res2[$count]['tracing'] = [];
				}
			}
		}
		$data = $query_res2;
		$data_length = $query_res[0]['COUNT(*)'];
		return array('data' => $data,'data_length' => $data_length);
	}

}


function db_GetPrograms($data)
{

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$SQL = "SELECT * FROM programs";
	$query_res = $db->query($SQL);
	return array('data' => $query_res);
}


function db_GetOffers($data)
{
	$us_id =  $data['us_id'];
	$us_type =  $data['us_type'];

	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	if ($us_type == '1') {
		$SQL = "SELECT
					OF.offer_id,
					OF.name,
					OF.description,
					OF.img,
					OF.company_id,
					OF_ST.offer_student_id,
					OF_ST.student_id,
					OF_ST.date,
					OF_ST.state,
					US_C.us_email as us_email_c,
					US_C.us_img as us_img_c,
					CI.comin_id,
					CI.comin_usersid,
					CI.comin_name,
					CI.comin_nit,
					CI.comin_address,
					CI.comin_phone,
					CI.comin_commerce,
					CI.comin_cardid,
					CI.comin_possesion,
					CI.comin_id,
					CI.comin_agreement,
					CI.comin_resolution
					FROM offers AS OF
					LEFT JOIN users AS US_C
					ON OF.company_id = US_C.us_id
					LEFT JOIN company_info AS CI
					ON OF.company_id = CI.comin_usersid
					LEFT JOIN offer_student AS OF_ST
					ON OF_ST.offer_id = OF.offer_id AND OF_ST.student_id = $us_id
					";
		$query_res = $db->query($SQL);
	} else if ($us_type == '2') {
		$SQL = "SELECT * FROM offers WHERE company_id = $us_id";
		$query_res = $db->query($SQL);
		for ($count=0; $count < count($query_res); $count++) {
			$SQL2 = "SELECT
					OF_ST.offer_student_id,
					OF_ST.student_id,
					OF_ST.offer_id,
					OF_ST.date,
					OF_ST.state,
					US.us_id,
					US.us_email,
					US.us_names,
					US.us_lastnames,
					US.us_img,
					US.us_type,
					US.us_state,
					US.us_last_login,
					ST.st_id,
					ST.st_usersid,
					ST.st_idnumber,
					ST.st_career,
					ST.st_isfree,
					ST.st_teacherassc,
					ST.st_celphone,
					ST.st_phone,
					ST.st_address,
					ST.st_schedule,
					ST.st_hv,
					ST.st_cardid,
					ST.st_eps,
					ST.st_enrollment,
					ST.st_practice,
					PR.pro_name
					FROM offer_student AS OF_ST
					LEFT JOIN users AS US
					ON OF_ST.student_id = US.us_id
					LEFT JOIN student_info AS ST
					ON US.us_id = ST.st_usersid
					LEFT JOIN programs AS PR
					ON ST.st_career = PR.pro_id
					WHERE OF_ST.offer_id = ".strval($query_res[$count]['offer_id']);
			$query_res2 = $db->query($SQL2);
			if (isset($query_res2)) {
				$query_res[$count]['applications'] = $query_res2;
			} else {
				$query_res[$count]['applications'] = [];
			}
		}
	} else if ($us_type == '3') {
		$SQL = "SELECT
					OF.offer_id,
					OF.name,
					OF.description,
					OF.img,
					OF.company_id,
					US_C.us_email as us_email_c,
					US_C.us_img as us_img_c,
					CI.comin_id,
					CI.comin_usersid,
					CI.comin_name,
					CI.comin_nit,
					CI.comin_address,
					CI.comin_phone,
					CI.comin_commerce,
					CI.comin_cardid,
					CI.comin_possesion,
					CI.comin_id,
					CI.comin_agreement,
					CI.comin_resolution
					FROM offers AS OF
					LEFT JOIN users AS US_C
					ON OF.company_id = US_C.us_id
					LEFT JOIN company_info AS CI
					ON OF.company_id = CI.comin_usersid
					";	
		$query_res = $db->query($SQL);
		for ($count=0; $count < count($query_res); $count++) {
			$SQL2 = "SELECT
					OF_ST.offer_student_id,
					OF_ST.student_id,
					OF_ST.offer_id,
					OF_ST.date,
					OF_ST.state,
					US.us_id,
					US.us_email,
					US.us_names,
					US.us_lastnames,
					US.us_img,
					US.us_type,
					US.us_state,
					US.us_last_login,
					ST.st_id,
					ST.st_usersid,
					ST.st_idnumber,
					ST.st_career,
					ST.st_isfree,
					ST.st_teacherassc,
					ST.st_celphone,
					ST.st_phone,
					ST.st_address,
					ST.st_schedule,
					ST.st_hv,
					ST.st_cardid,
					ST.st_eps,
					ST.st_enrollment,
					ST.st_practice,
					PR.pro_name
					FROM offer_student AS OF_ST
					LEFT JOIN users AS US
					ON OF_ST.student_id = US.us_id
					LEFT JOIN student_info AS ST
					ON US.us_id = ST.st_usersid
					LEFT JOIN programs AS PR
					ON ST.st_career = PR.pro_id
					WHERE OF_ST.offer_id = ".strval($query_res[$count]['offer_id']);
			$query_res2 = $db->query($SQL2);
			if (isset($query_res2)) {
				$query_res[$count]['applications'] = $query_res2;
			} else {
				$query_res[$count]['applications'] = [];
			}
		}
	} else {
		$SQL = "SELECT * FROM offers";
		$query_res = $db->query($SQL);
	}
	
	return array('data' => $query_res);
}

function db_ApplyOffer($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_id =  $data['us_id'];
	$offer_id = $data['offer_id'];

	$SQL = "INSERT INTO offer_student(student_id, offer_id) VALUES ('$us_id','$offer_id')";
   	$query_res3 = $db->query($SQL);

   	return array('data' => 'ok');
}

function db_DeleteApplyOffer($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$offer_student_id = $data['offer_student_id'];
	
	$SQL = "DELETE FROM offer_student WHERE  offer_student_id = $offer_student_id";
   	$query_res3 = $db->query($SQL);

   	return array('data' => 'ok');
}

function db_AcceptApplyOffer($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$offer_student_id = $data['offer_student_id'];

	$SQL = "UPDATE offer_student SET state = 1 WHERE  offer_student_id = '$offer_student_id'";
   	$query_res3 = $db->query($SQL);

   	return array('data' => 'ok');
}

function db_DenyApplyOffer($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$offer_student_id = $data['offer_student_id'];

	$SQL = "UPDATE offer_student SET state = 2 WHERE  offer_student_id = '$offer_student_id'";
   	$query_res3 = $db->query($SQL);

   	return array('data' => 'ok');
}

function db_AdminAcceptApplyOffer($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$offer_student_id = $data['offer_student_id'];
	$student_id = $data['student_id'];

	$SQL = "UPDATE student_info SET st_isfree = 0 WHERE  st_usersid = $student_id";
   	$query_res3 = $db->query($SQL);

	$SQL = "UPDATE offer_student SET state = 3 WHERE  offer_student_id = '$offer_student_id'";
   	$query_res3 = $db->query($SQL);

   	return array('data' => 'ok');
}

function db_SaveFile($data)
{
	$db = new Db();
	$zone = zoneH();
	date_default_timezone_set($zone);

	$us_id =  $data['us_id'];
	$us_type = $data['us_type'];
	$file_name = $data['file_name'];
	$actual_link = '';

	if($us_type == 1){ //Estudiante
		$targetdir = '/uploads/student/';
		$targetfile = realpath(dirname(__FILE__))."$targetdir$us_id-$us_type-$file_name";

		if ($file_name == 'avancemensual.pdf') {
			$SQL = "SELECT COUNT(*) FROM student_avance WHERE stav_student_id = $us_id";
			$query_res = $db->query($SQL);
			if(empty($query_res) || $query_res[0]["COUNT(*)"] == 0) {
				$count = 0;
			} else {
				$count = $query_res[0]["COUNT(*)"];
			}
			$targetfile = realpath(dirname(__FILE__))."$targetdir$us_id-$us_type-$count-$file_name";
			$actual_link = "http://$_SERVER[HTTP_HOST]/SGVP-BackEnd/custom_cruds$targetdir$us_id-$us_type-$count-$file_name";
		}
		if ($file_name == 'seguimientoasesoria.pdf') {
			$SQL = "SELECT COUNT(*) FROM student_seguimiento_asesoria WHERE stseas_student_id = $us_id";
			$query_res = $db->query($SQL);
			$count = 0;
			if(empty($query_res) || $query_res[0]["COUNT(*)"] == 0) {
				$count = 0;
			} else {
				$count = $query_res[0]["COUNT(*)"];
			}
			$targetfile = realpath(dirname(__FILE__))."$targetdir$us_id-$us_type-$count-$file_name";
			$actual_link = "http://$_SERVER[HTTP_HOST]/SGVP-BackEnd/custom_cruds$targetdir$us_id-$us_type-$count-$file_name";
		}
	}
	if($us_type == 2){ // Empresa
		$targetdir = '/uploads/enterprise/';
		$targetfile = realpath(dirname(__FILE__))."$targetdir$us_id-$us_type-$file_name";
		if (isset($data['student_id'])) {
			$targetdir = '/uploads/student/';
			$student_id = $data['student_id'];
			$targetfile = realpath(dirname(__FILE__))."$targetdir$student_id-1-$file_name";
		}
	}

	if($us_type == 4){ // Docente
		$student_id = $data['student_id'];
		$targetdir = '/uploads/student/';
		$student_id = $data['student_id'];
		$targetfile = realpath(dirname(__FILE__))."$targetdir$student_id-1-$file_name";

		if ($file_name == 'seguimiento.pdf') {
			$targetdir = '/uploads/teacher/';
			$SQL = "SELECT COUNT(*) FROM teacher_student_tracing WHERE tst_teacher_id = $us_id AND tst_student_id = $student_id";
			$query_res = $db->query($SQL);
			if(empty($query_res) || $query_res[0]["COUNT(*)"] == 0) {
				$count = 0;
			} else {
				$count = $query_res[0]["COUNT(*)"];
			}
			$targetfile = realpath(dirname(__FILE__))."$targetdir$us_id-$us_type-$student_id-$count-$file_name";
			$actual_link = "http://$_SERVER[HTTP_HOST]/SGVP-BackEnd/custom_cruds$targetdir$us_id-$us_type-$student_id-$count-$file_name";
		}
	}

	if (move_uploaded_file($_FILES['file']['tmp_name'], $targetfile)) {
		// file uploaded succeeded
		if ($actual_link == '') {
			$actual_link = "http://$_SERVER[HTTP_HOST]/SGVP-BackEnd/custom_cruds$targetdir$us_id-$us_type-$file_name";
		}

		switch ($file_name) 
		{
			case 'hv.pdf':
				$SQL3 = "UPDATE student_info SET st_hv = '$actual_link' WHERE  st_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'cardid.pdf':
				if ($us_type == 1) {
					$SQL3 = "UPDATE student_info SET st_cardid = '$actual_link' WHERE  st_usersid = '$us_id'";
				}
				if ($us_type == 2) {
					$SQL3 = "UPDATE company_info SET comin_cardid = '$actual_link' WHERE  comin_usersid = '$us_id'";
				}
   				$query_res3 = $db->query($SQL3);
			break;
			case 'eps.pdf':
				$SQL3 = "UPDATE student_info SET st_eps = '$actual_link' WHERE  st_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'enrollment.pdf':
				$SQL3 = "UPDATE student_info SET st_enrollment = '$actual_link' WHERE  st_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'practice.pdf':
				$SQL3 = "UPDATE student_info SET st_practice = '$actual_link' WHERE  st_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'commerce.pdf':
				$SQL3 = "UPDATE company_info SET comin_commerce = '$actual_link' WHERE  comin_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'rut.pdf':
				$SQL3 = "UPDATE company_info SET comin_rut = '$actual_link' WHERE  comin_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'possesion.pdf':
				$SQL3 = "UPDATE company_info SET comin_possesion = '$actual_link' WHERE  comin_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'conveniomarco.pdf':
				$SQL3 = "UPDATE company_info SET comin_agreement = '$actual_link' WHERE  comin_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'decretodep.pdf':
				$SQL3 = "UPDATE company_info SET comin_resolution = '$actual_link' WHERE  comin_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'seguimiento.pdf':
				$SQL3 = "INSERT INTO teacher_student_tracing(tst_teacher_id, tst_student_id, tst_document) VALUES ('$us_id','$student_id', '$actual_link')";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'conveniopractica.pdf':
				$SQL3 = "UPDATE student_info SET st_agreement_practice = '$actual_link' WHERE  st_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;	
			case 'actapractica.pdf':
				$SQL3 = "UPDATE student_info SET st_acta_practice = '$actual_link' WHERE  st_usersid = '$us_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'cumplimientopractica.pdf':
				$SQL3 = "UPDATE student_info SET st_cumplimiento_practice = '$actual_link' WHERE  st_usersid = '$student_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'evaluacionpractica.pdf':
				$SQL3 = "UPDATE student_info SET st_evaluacion_practice = '$actual_link' WHERE  st_usersid = '$student_id'";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'informefinalpractica.pdf':
				if($us_type == 1){ //Estudiante
					$SQL3 = "UPDATE student_info SET st_informefinal_practice = '$actual_link' WHERE  st_usersid = '$us_id'";
				} else {
					$SQL3 = "UPDATE student_info SET st_informefinal_practice = '$actual_link' WHERE  st_usersid = '$student_id'";
				}
   				$query_res3 = $db->query($SQL3);
			break;
			case 'avancemensual.pdf':
				$SQL3 = "INSERT INTO student_avance(stav_student_id, stav_document) VALUES ('$us_id', '$actual_link')";
   				$query_res3 = $db->query($SQL3);
			break;
			case 'seguimientoasesoria.pdf':
				$SQL3 = "INSERT INTO student_seguimiento_asesoria(stseas_student_id, stseas_document) VALUES ('$us_id', '$actual_link')";
   				$query_res3 = $db->query($SQL3);
			break;
		}
		return array('data' => 'ok', 'url' => $actual_link);
	} else {
		// file upload failed
		return array('data' => 'error');
	}
}




//RETORNAR ZONA HORARIA

function zoneH()
{
	$zone = 'America/Bogota';
	return $zone;
}
 ///

//GENERAR PASSWORD
function db_GeneratePassword(){

    $cadena = "abcdefghijklmnopqrstuvwxyz1234567890";
    $longitudCadena=strlen($cadena);
    $pass = "";
    $longitudPass=8;
    for($i=1 ; $i<=$longitudPass ; $i++){
        $pos=rand(0,$longitudCadena-1);
        $pass .= substr($cadena,$pos,1);
    }
    return $pass;
}

//

//ENVIAR MAIL

function sendMail($destinatario,$data,$data2)
{

	require_once("./lib/PHPMailer/class.phpmailer.php");
	require_once("./lib/PHPMailer/class.smtp.php");
	$mail = new PHPMailer();
	$mail->IsSMTP();
	$mail->SMTPAuth = true;
	$mail->SMTPSecure = 'ssl';
	$mail->Host = "smtp.gmail.com";
	$mail->Port = 465;
	$mail->Username = 'sgvpulp@gmail.com';
	$mail->Password = 'sgvpulp2017';
	$mail->From = 'brian.giraldo.m@gmail.com';
	$mail->FromName = "SGVP";
	$mail->Subject = "Recuperacion clave de acceso - Sistema de Gestión de Practicas Virtuales";
	$content = '<!DOCTYPE html>';
	$content .= '<html lang="en">';
	$content .= '<head>';
	$content .=  '<meta charset="UTF-8">';
	$content .=  '<title>SGVP</title>';
	$content .=  '</head>';
	$content .=  '<body style="background:linear-gradient(45deg, rgba(131,172,174,0.7) 0%, rgba(255,250,250,0.7) 100%);background-attachment: fixed;background-position: center center;background-size: cover;background-repeat: no-repeat;padding:1em;">';

	$content .= "<p style='background-color:white;padding:1em;width:90%;color:gray;'>";
	$content .= "<span style='font-size:1.4em;'>Hola ".$data2[0]["us_names"]."!</span><br><br>";
	$content .= "<span>Su nueva clave de acceso es: <span> ".$data."</span>";
	$content .= "</p>";

	$content .= "<p style='background-color:white;padding:1em;width:90%;color:gray;'>";
	$content .= "Este correo electronico se ha generado automaticamente. Por favor, no conteste a este correo electronico. Si tiene alguna pregunta o necesita ayuda, por favor dirigase a la universidad<br><br>";
	$content .= "Atentamente,<br><br>";
	$content .= "<span>SGVP</span><br>";
	$content .= "<span>Universidad Libre Pereira</span>";
	$content .= "</p>";

	$content .= '</body>';
	$content .=  '</html>';
	$mail->MsgHTML($content);
	$mail->AddAddress($destinatario, $data2[0]["us_names"]);
	$mail->IsHTML(true);
	if(!$mail->Send()) {
	echo "Error: " . $mail->ErrorInfo;
	} else {
	//echo "Mensaje enviado correctamente";
	}

}

function clean_stav_document($item) {
	return $item['stav_document'];
}

function clean_stseas_document($item) {
	return $item['stseas_document'];
}














?>
