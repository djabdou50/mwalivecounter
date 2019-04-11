<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Log;
use Firebase;

class CrawlJob extends Job
{

	protected $data;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
	    Log::debug('Job Crawl Log url : ' . $this->data );

	    $html = curl( $this->data );
	    $votes = extractVotes( $html);

//	    $voteValue = ["votes" => $votes['votes']];
//
//	    foreach ($votes as $vote ){
//		    Firebase::push('/candidats-v2/'. $vote['id'].'/votes', $vote);
//		    Firebase::update('/candidats-v2/'. $vote['id'].'', $voteValue);
//	    }

	    foreach ($votes as $vote ){
		    $currentVal = ['votes' => $vote['votes']];

		    Firebase::push('/candidats/'. $vote['id'].'', $vote);
		    Firebase::update('/candidats/'. $vote['id'].'', $currentVal);

	    }

    }
}
