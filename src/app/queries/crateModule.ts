import gql from 'graphql-tag';

export default gql`
    mutation AddModule($name: String!, $bodytext: String!, $price: Float!, $groupId: Int) {
        addModule(name: $name, bodytext: $bodytext, price: $price, groupId: $groupId ){
            _id
            name
        }
    }
`;
