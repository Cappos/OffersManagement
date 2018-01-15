import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreateOffer( $offerTitle: String!, $offerNumber: String, $totalPrice: Float, $bodytext: String, $client: ID, $groups: JSON, $seller: ID) {
        addOffer(offerTitle: $offerTitle, offerNumber: $offerNumber, totalPrice: $totalPrice, bodytext: $bodytext, client: $client, groups: $groups, sealer: $seller){
            offerTitle
        }
    }
`;