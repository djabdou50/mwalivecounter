<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Jobs\CrawlJob;
use Illuminate\Support\Facades\Queue;
use Firebase;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

	public function show() {

		Log::debug('Start crawling all categories...');

		$cats = Firebase::get('/categories/',['print'=> 'pretty']);
		$results = json_decode( $cats );



		$html = curl( $results[16]->link );
	    $votes = extractVotes( $html);
//
	    var_dump( $votes );

		foreach ($votes as $vote ){
			$currentVal = ['votes' => $vote['votes']];

			Firebase::push('/candidats-v2/'. $vote['id'].'', $vote);
			Firebase::update('/candidats-v2/'. $vote['id'].'', $currentVal);

		}



//		foreach ( $results as $result ) {
//			Queue::push(new CrawlJob($result->link));
//		}

    }

	public function categories() {

		$resp = curl( "https://vote.marocwebawards.com/");
		$results = extractCategories( $resp );

		Firebase::set('/categories', $results);

		Log::debug('Extract categories from website.');

//		Queue::push(new CrawlJob("url"));

	}

	// patch some candidat that not existing

	public function collectCandidats(){

//    	$cats = Firebase::get('/categories/',['print'=> 'pretty']);
//    	$categories = json_decode( $cats );
//
//
//		foreach ( $categories as $category ){
//			$html = curl( $category->link );
//			$candidats = extractCandidats( $html);
//
//		}


		$html = curl( "https://vote.marocwebawards.com/sports" );
		$candidats = extractCandidats( $html);

//		var_dump( $candidats );

		foreach ($candidats as $candidat){


//			$id = str_replace(array('https://vote.marocwebawards.com/', '/'), array('', '-'), $candidat['id']);

			$result = Firebase::get('/candidats/' . $candidat['id'],['print'=> 'pretty']);

//			echo $result;

			if( stripos($result, 'null') !== false ){
				echo $candidat['name'] . 'dosent existe' ;

				Firebase::sed('/candidats/'. $candidat['id'].'', $candidat);

			}else{
				echo "skiped";
			}


		}






	}


}
