import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreateOffer(
    $offerTitle: String!,
    $offerNumber: String,
    $totalPrice: Float,
    $bodytext: String,
    $expDate: String,
    $client: ID,
    $groupsNew: JSON,
    $files: JSON,
    $seller: ID,
    $internalHours: Float,
    $externalHours: Float) {
        addOffer(
            offerTitle: $offerTitle,
            offerNumber: $offerNumber,
            totalPrice: $totalPrice,
            bodytext: $bodytext,
            expDate: $expDate,
            client: $client,
            groupsNew: $groupsNew,
            files: $files,
            sealer: $seller,
            internalHours: $internalHours,
            externalHours: $externalHours){
            _id,
            offerTitle
        }
    }
`;