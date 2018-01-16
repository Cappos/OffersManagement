import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreateOffer( 
    $offerTitle: String!, 
    $offerNumber: String, 
    $totalPrice: Float, 
    $bodytext: String, 
    $client: ID, 
    $groupsNew: JSON, 
    $offerPages: JSON, 
    $seller: ID) {
        addOffer(
            offerTitle: $offerTitle, 
            offerNumber: $offerNumber, 
            totalPrice: $totalPrice, 
            bodytext: $bodytext, 
            client: $client, 
            groupsNew: $groupsNew, 
            offerPages: $offerPages, 
            sealer: $seller){
            _id,
            offerTitle
        }
    }
`;