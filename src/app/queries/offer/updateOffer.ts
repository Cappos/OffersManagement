import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation UpdateOffer(
    $id: ID!,
    $offerTitle: String!,
    $offerNumber: String,
    $totalPrice: Float,
    $signedPrice: Float,
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
    $externalHours: Float,
    $comments: String) {
        editOffer(
            id: $id,
            offerTitle: $offerTitle,
            offerNumber: $offerNumber,
            totalPrice: $totalPrice,
            signedPrice: $signedPrice,
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
            externalHours: $externalHours
            comments: $comments){
            _id,
            offerTitle
        }
    }
`;

