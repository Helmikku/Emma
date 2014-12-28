<?php if ($success) {
	echo('{"success":true, "works":'.json_encode($works, JSON_NUMERIC_CHECK).'}');
} else {
	echo('{"success":false, "error":'.json_encode($error).'}');
} ?>