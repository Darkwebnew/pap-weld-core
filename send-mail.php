<?php
/**
 * send-mail.php
 * Handles submissions from contact.html's #contact-form.
 * Works on standard GoDaddy shared hosting (PHP mail()).
 */

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// ----- CONFIG -----
$recipient = 'weldcoreautomation@gmail.com';
$siteName  = 'Pap Weld Core Automation Website';

// ----- COLLECT + SANITIZE INPUT -----
function clean($value) {
    return htmlspecialchars(trim($value ?? ''), ENT_QUOTES, 'UTF-8');
}

$name        = clean($_POST['name'] ?? '');
$company     = clean($_POST['company'] ?? '');
$email       = clean($_POST['email'] ?? '');
$phone       = clean($_POST['phone'] ?? '');
$requirement = clean($_POST['requirement'] ?? '');
$message     = clean($_POST['message'] ?? '');

// Honeypot-style / basic spam guard: reject if key fields are empty
if ($name === '' || $email === '') {
    http_response_code(422);
    exit('Missing required fields.');
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    exit('Invalid email address.');
}

// ----- BUILD EMAIL -----
$subject = "New Contact Form Submission from {$name}";

$body  = "You have received a new enquiry from the {$siteName} contact form.\n\n";
$body .= "Name: {$name}\n";
$body .= "Company: " . ($company !== '' ? $company : '—') . "\n";
$body .= "Email: {$email}\n";
$body .= "Phone: " . ($phone !== '' ? $phone : '—') . "\n";
$body .= "Requirement: " . ($requirement !== '' ? $requirement : '—') . "\n\n";
$body .= "Message:\n" . ($message !== '' ? $message : '—') . "\n";

// Use a safe From address on your own domain; Reply-To is the visitor's
// email so hitting "Reply" in your inbox goes straight back to them.
$headers  = "From: {$siteName} <no-reply@YOURDOMAIN.com>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ----- SEND -----
$sent = mail($recipient, $subject, $body, $headers);

if ($sent) {
    http_response_code(200);
    echo 'success';
} else {
    http_response_code(500);
    echo 'error';
}
