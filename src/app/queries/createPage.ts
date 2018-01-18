import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreatePage($title: String!, $subtitle: String, $bodytext: String, $order: Int) {
        addPage(title: $title, subtitle: $subtitle, bodytext: $bodytext, order: $order){
            title
        }
    }
`;