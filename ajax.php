<?php
/**
 * Created by PhpStorm.
 * User: HOME
 * Date: 1/12/2021
 * Time: 5:35 PM
 */
function querySelectSql($con, $sql)
{
    $list_result = mysqli_query($con, $sql);
    $list = [];
    while ($item = mysqli_fetch_array($list_result)) {
        $list[] = $item;
    }
    return $list;
}
$_POST = json_decode(file_get_contents("php://input"),true);
$type = $_POST["type"];
/*$host = "localhost";
$user = "fivestu2_barcode";
$passwd = "barcode";
$dbname = "fivestu2_distfmqn_portal";*/

$host = "localhost";
$user = "root";
$passwd = "";
$dbname = "distfmqn_portal";


if ($type == "code-detected") {

    $code = $_POST["code"];
    $cxn = mysqli_connect($host, $user, $passwd, $dbname)
    or die(json_decode(["message" => "couldn't connect to server", "success" => false]));
    $product = querySelectSql($cxn,"select * from catalog_produse where cod_de_bare=$code");
    $product = count($product)?$product[0]:"not registered";
    $insertId = 0;
    if($product != "not registered"){
        /// insert product to stock
        $stock = querySelectSql($cxn,"select * from stock where cod_de_bare = $code");
        $date = date("Y-m-d H:i:s");
        if(!count($stock)) {
            $sql = sprintf("insert into stock (cod_de_bare,name_produs,count,pret_cu_tva,pret_fara_tva,scanned_at) 
                value('%s','%s',1,%s,%s,'%s')", $product["cod_de_bare"], $product["name_produs"], $product["pret_cu_tva"]
                , $product["pret_fara_tva"], $date);
            mysqli_query($cxn, $sql);
            $product["count"] = 1;
            $insertId = mysqli_insert_id($cxn);
        } else{
            $sql = sprintf("update stock SET count=%d where cod_de_bare=%s",$stock[0]["count"]+1,$code);
            mysqli_query($cxn, $sql);
            $product = $stock[0];
            $product["count"] = $product["count"] + 1;
            $insertId = $stock[0]["id"];

        }
    }
    echo json_encode(["success" => true,'product'=>$product,'insertId'=>$insertId]);

}
else if($type == "clear-stock"){
    $cxn = mysqli_connect($host, $user, $passwd, $dbname)
        or die(json_decode(["message" => "couldn't connect to server", "success" => false]));
    $sql = "delete from stock where id > 0";
    mysqli_query($cxn,$sql);
    echo json_encode(["success" => true]);

}
else if($type == "list"){
    $cxn = mysqli_connect($host, $user, $passwd, $dbname)
    or die(json_decode(["message" => "couldn't connect to server", "success" => false]));
    $sql = "select id,cod_de_bare as code,name_produs as `product name`,count,count*pret_cu_tva as price from stock order by scanned_at desc";
    mysqli_query($cxn,$sql);
    $products = querySelectSql($cxn,$sql);
    echo json_encode(["success" => true,'products'=>$products]);

}