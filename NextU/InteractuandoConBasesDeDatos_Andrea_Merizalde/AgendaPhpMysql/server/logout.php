<?php
session_unset();
session_destroy();
// Redirecciona a pagina de login
header("Location: ../client/index.html");
 ?>
