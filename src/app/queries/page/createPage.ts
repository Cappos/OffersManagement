import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreatePage($title: String!, $subtitle: String, $bodytext: String, $order: Int, $files: JSON) {
        addPage(title: $title, subtitle: $subtitle, bodytext: $bodytext, order: $order, files: $files){
            title
        }
    }
`;