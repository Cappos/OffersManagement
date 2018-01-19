import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation UpdateOffer(
    $id: ID!,
    $offerTitle: String!,
    $offerNumber: String,
    $totalPrice: Float,
    $bodytext: String,
    $expDate: String,
    $client: ID,
    $groupsNew: JSON,
    $files: JSON,
    $signed: Boolean,
    $seller: ID) {
        editOffer(
            id: $id,
            offerTitle: $offerTitle,
            offerNumber: $offerNumber,
            totalPrice: $totalPrice,
            bodytext: $bodytext,
            expDate: $expDate,
            client: $client,
            groupsNew: $groupsNew,
            files: $files,
            signed: $signed
            sealer: $seller){
            _id,
            offerTitle
        }
    }
`;

