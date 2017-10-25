<?php
if(isset($_POST['email'])) {
 
    // EDIT THE 2 LINES BELOW AS REQUIRED
    $email_from = "arboard@arbortutors.net";
    $email_to = $_POST['email'];
    $email_subject = "Your Tutor has started an ArBoard Session";
 
    $email_message = "Join your tutor with this password:\n\n";
 
    $email_message .= $_POST['session'];
 
// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);  
?>
 
<!-- include your own success html here -->
 
Your client has been emailed. You can now close this page.
 
<?php
 
}
?>