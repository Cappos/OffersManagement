import gql from 'graphql-tag';

export default gql`
    mutation UpdateClient($id: ID!, $contactPerson: String, $companyName: String!, $address: String, $contactPhone: String, $mobile: String, $mail: String, $webSite: String, $pib: String, $offers: ID) {
        editClient(id: $id, contactPerson: $contactPerson, companyName: $companyName, address: $address, contactPhone: $contactPhone, mobile: $mobile, mail: $mail, webSite: $webSite, pib: $pib, offers: $offers){
            companyName
        }
    }
`;
