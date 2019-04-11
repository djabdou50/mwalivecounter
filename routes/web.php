<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});


$router->get('/test', [
	'as' => 'test', 'uses' => 'HomeController@show'
]);

$router->get('/cat', [
	'as' => 'cat', 'uses' => 'HomeController@categories'
]);

$router->get('/can', [
	'as' => 'can', 'uses' => 'HomeController@collectCandidats'
]);

