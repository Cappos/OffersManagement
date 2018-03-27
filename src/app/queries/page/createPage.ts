import gql from 'graphql-tag';
import 'graphql-type-json';

export default gql`
    mutation CreatePage($title: String!, $subtitle: String, $bodytext: String, $order: Int, $files: JSON, $pageType: Int) {
        addPage(title: $title, subtitle: $subtitle, bodytext: $bodytext, order: $order, files: $files, pageType: $pageType){
            title
        }
    }
`;