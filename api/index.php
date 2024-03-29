<?php
include 'config/config.php';

/**
 * Index file that is responsible for managing endpoints.
 *
 * @author Szymon Jedrzychowski
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST', 'DELETE'])) {
    $endpoint = new ClientError("Invalid method: " . $_SERVER['REQUEST_METHOD'], 405);
} else {
    $url = $_SERVER["REQUEST_URI"];
    $url = parse_url($url);
    $path = str_replace(PATH, "", $url['path']);
    try {
        switch ($path) {
            case '/':
                $endpoint = new Base();
                break;
            case '/getnewsletteritems':
                $endpoint = new GetNewsletterItems();
                break;
            case '/changeitemstatus':
                $endpoint = new ChangeItemStatus();
                break;
            case '/postnewslettersuggestion':
                $endpoint = new PostNewsletterSuggestion();
                break;
            case '/addtag':
                $endpoint = new AddTag();
                break;
            case '/edittag':
                $endpoint = new EditTag();
                break;
            case '/removetag':
                $endpoint = new RemoveTag();
                break;
            case '/gettags':
                $endpoint = new GetTags();
                break;
            case '/getitemtags':
                $endpoint = new GetItemTags();
                break;
            case '/publishnewsletter':
                $endpoint = new PublishNewsletter();
                break;
            case '/removepublishednewsletter':
                $endpoint = new RemovePublishedNewsletter();
                break;
            case '/getpublishednewsletters':
                $endpoint = new GetPublishedNewsletters();
                break;
            case '/adduser':
                $endpoint = new AddUser();
                break;
            case '/verify':
                $endpoint = new Verify();
                break;
            case '/authenticate':
                $endpoint = new Authenticate();
                break;
            case '/editnewsletter':
                $endpoint = new EditNewsletter();
                break;
            case '/postitemtags':
                $endpoint = new PostItemTags();
                break;
            case '/addsubscriber':
                $endpoint = new AddSubscriber();
                break;
            case '/postnewsletteritem':
                $endpoint = new PostNewsletterItem();
                break;
            case '/removenewsletteritem':
                $endpoint = new RemoveNewsletterItem();
                break;
            case '/updatenewsletteritem':
                $endpoint = new UpdateNewsletterItem();
                break;
            case '/getnewslettersuggestion':
                $endpoint = new GetNewsletterSuggestion();
                break;
            case '/postsuggestionresponse':
                $endpoint = new PostSuggestionResponse();
                break;
            case '/sendnewsletter':
                $endpoint = new SendNewsletter();
                break;
            case '/getlastpublishednewsletter':
                $endpoint = new GetLastPublishedNewsletter();
                break;
            case '/getUsers':
                $endpoint = new getUsers();
                break;
            case '/updateUser':
                $endpoint = new updateUser();
                break;
            case '/getNextNewsletterDate':
                $endpoint = new getNextNewsletterDate();
                break;
            case '/updateNextNewsletterDate':
                $endpoint = new updateNextNewsletterDate();
                break;
            case '/getOrganisations':
                $endpoint = new getOrganisations();
                break;
            case '/deleteOrganisation':
                $endpoint = new deleteOrganisation();
                break;
            case '/createOrganisation':
                $endpoint = new createOrganisation();
                break;
            case '/updateOrganisation':
                $endpoint = new updateOrganisation();
                break;
            case '/getStats':
                $endpoint = new getStats();
                break;
            case '/getTag':
                $endpoint = new getTag();
                break;
            case '/deleteUser':
                $endpoint = new deleteuser();
                break;
            default:
                $endpoint = new ClientError("Path not found: " . $path, 404);
                break;
        }
    } catch (ClientErrorException $e) {
        $endpoint = new ClientError($e->getMessage(), $e->getCode());
    } catch (BadRequest $e) {
        $endpoint = new ClientError($e->getMessage(), $e->getCode());
    }
}
$response = $endpoint->getData();
echo json_encode($response);
