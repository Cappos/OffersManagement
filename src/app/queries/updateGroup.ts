import gql from 'graphql-tag';

export default gql`
    mutation UpdateGroup($id: ID!, $name: String!, $subTotal: Float, $modules: ID) {
        editGroup(id: $id, name: $name, subTotal: $subTotal, modules: $modules){
            name
        }
    }
`;

