<?php
/**
 * Project mwa.
 * User: Abdeltif Bouziane <contact@eyetags.net>
 * Date: 13/02/2019
 * Time: 15:58
 */

function curl($url){

	// Get cURL resource
	$curl = curl_init();
	// Set some options - we are passing in a useragent too here
	curl_setopt_array($curl, array(
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_URL => $url,
		CURLOPT_USERAGENT => 'MWA realtime status'
	));
	// Send the request & save response to $resp
	$resp = curl_exec($curl);
	// Close request to clear up some resources
	curl_close($curl);

	return $resp;

}

/**
 * provision database with categories
 * @param $html
 *
 * @return array
 */

function extractCategories($html){

	$document = new \DOMDocument('1.0', 'UTF-8');
	// set error level
	$internalErrors = libxml_use_internal_errors(true);
	// load HTML
	$document->loadHTML($html);
	// Restore error level
	libxml_use_internal_errors($internalErrors);
	$xpath = new DOMXPath($document);

	$divContent = $xpath->query('//article/a');

	$categories = [];
	foreach ( $divContent as $item ) {
		$categories[] = [
			'name' => trim( $item->nodeValue ),
			'link' => 'https://vote.marocwebawards.com' . $item->getAttribute('href')
		];
	}
	return $categories;
}

/**
 * extract votes
 * @param $html
 *
 * @return array
 */

function extractVotes($html){

	$document = new \DOMDocument('1.0', 'UTF-8');
	// set error level
	$internalErrors = libxml_use_internal_errors(true);
	// load HTML
	$document->loadHTML($html);
	// Restore error level
	libxml_use_internal_errors($internalErrors);
	$xpath = new DOMXPath($document);

	$divContent = $xpath->query('//*[@id="candidats"]/div');

	$category = $xpath->query('//html/body/section/div/h2')[0]->nodeValue;

//	var_dump( $category );

	$voteData = [];
	foreach ( $divContent as $item ) {

		$id = $xpath->query('.//a', $item)[0]->getAttribute('href');
		$id = str_replace(array('https://vote.marocwebawards.com/', '/'), array('', '-'), $id);

		$voteData[$id] = [
			'votes' => (int)$item->getAttribute('data-votes'),
			'id' => $id,
			'created_at' => strtotime("now")
		];
	}

	return $voteData;

}

/**
 * provision database with candidats
 * @param $html
 *
 * @return array
 */

function extractCandidats($html){

	$document = new \DOMDocument('1.0', 'UTF-8');
	// set error level
	$internalErrors = libxml_use_internal_errors(true);
	// load HTML
	$document->loadHTML($html);
	// Restore error level
	libxml_use_internal_errors($internalErrors);
	$xpath = new DOMXPath($document);

	$divContent = $xpath->query('//*[@id="candidats"]/div');

	$category = $xpath->query('//html/body/section/div/h2')[0]->nodeValue;

//	var_dump( $category );

	$voteData = [];
	foreach ( $divContent as $item ) {

		$id = $xpath->query('.//a', $item)[0]->getAttribute('href');
		$id = str_replace(array('https://vote.marocwebawards.com/', '/'), array('', '-'), $id);

		$voteData[$id] = [
			'name' => trim( $xpath->query('.//a/h2', $item)[0]->nodeValue ),
			'link' => $xpath->query('.//a', $item)[0]->getAttribute('href'),
			'img' => 'https://vote.marocwebawards.com' . $xpath->query('.//a/img', $item)[0]->getAttribute('data-src'),
			'category' => $category,
			'id' => $id,
			'created_at' => strtotime("now"),
			'votes' => 0
		];
	}

	return $voteData;

}