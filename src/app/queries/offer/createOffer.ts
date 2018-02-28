import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreateOffer(
    $offerTitle: String!,
    $offerNumber: String,
    $totalPrice: Float,
    $signedPrice: Float,
    $bodytext: String,
    $expDate: String,
    $client: ID,
    $groupsNew: JSON,
    $files: JSON,
    $seller: ID,
    $internalHours: Float,
    $externalHours: Float,
    $comments: String,) {
        addOffer(
            offerTitle: $offerTitle,
            offerNumber: $offerNumber,
            totalPrice: $totalPrice,
            signedPrice: $signedPrice,
            bodytext: $bodytext,
            expDate: $expDate,
            client: $client,
            groupsNew: $groupsNew,
            files: $files,
            sealer: $seller,
            internalHours: $internalHours,
            externalHours: $externalHours,
            comments: $comments){
            _id,
            offerTitle
        }
    }
`;