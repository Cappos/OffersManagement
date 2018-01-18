import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation UpdateOffer(
    $offerTitle: String!,
    $offerNumber: String,
    $totalPrice: Float,
    $bodytext: String,
    $client: ID,
    $groupsNew: JSON,
    $files: JSON,
    $seller: ID) {
        editOffer(
            offerTitle: $offerTitle,
            offerNumber: $offerNumber,
            totalPrice: $totalPrice,
            bodytext: $bodytext,
            client: $client,
            groupsNew: $groupsNew,
            files: $files,
            sealer: $seller){
            _id,
            offerTitle
        }
    }
`;

