<?php if ($success) {
	echo('{success: true, exhibitions: '.json_encode($exhibitions, JSON_NUMERIC_CHECK).'}');
} else {
	echo('{success: false, error: '.json_encode($error).'}');
} ?>