<?php
/**
 * Project mwa.
 * User: Abdeltif Bouziane <contact@eyetags.net>
 * Date: 14/02/2019
 * Time: 17:06
 */

namespace App\Console\Commands;


use App\User;
use App\DripEmailer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Firebase;
use App\Jobs\CrawlJob;
use Illuminate\Support\Facades\Queue;

class CrawlCommand extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'crawl';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Crawl all mwa categories';


	/**
	 * Create a new command instance.
	 *
	 * @param  DripEmailer  $drip
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();

	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function handle()
	{
		Log::debug('Start crawling all categories...');

		$cats = Firebase::get('/categories/',['print'=> 'pretty']);
		$results = json_decode( $cats );


		foreach ( $results as $result ) {
			Queue::push(new CrawlJob($result->link));
		}

		Log::debug('Commande Extract data executed...');
	}
}