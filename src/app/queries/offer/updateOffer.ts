import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation UpdateOffer(
    $id: ID!,
    $offerTitle: String!,
    $offerNumber: String,
    $totalPrice: Float,
    $bodytext: String,
    $tstamp: String,
    $expDate: String,
    $client: ID,
    $groupsNew: JSON,
    $files: JSON,
    $signed: Boolean,
    $seller: ID,
    $oldClient: ID,
    $oldSeller: ID,
    $internalHours: Float,
    $externalHours: Float) {
        editOffer(
            id: $id,
            offerTitle: $offerTitle,
            offerNumber: $offerNumber,
            totalPrice: $totalPrice,
            bodytext: $bodytext,
            tstamp:$tstamp,
            expDate: $expDate,
            client: $client,
            groupsNew: $groupsNew,
            files: $files,
            signed: $signed
            sealer: $seller,
            oldClient: $oldClient,
            oldSeller: $oldSeller,
            internalHours: $internalHours,
            externalHours: $externalHours){
            _id,
            offerTitle
        }
    }
`;
