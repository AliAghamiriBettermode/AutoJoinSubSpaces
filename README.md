# AutoJoin Sub Spaces

This project provides a service to handle automatically joining sub spaces after joining a main space.

## Flow Overview

1. **Create an App and Install It**
    - Obtain `client_id`, `client_secret`, and `webhook_signing_secret`.

2. **Setup Webhooks**
    - Add a domain name for handling webhooks.
    - Add "space_membership.created" and "space_membership.deleted" events.
    - Update webhooks.

3. **Get an Admin Member ID**
    - Retrieve it from the "People" tab of the administration panel.

4. **Create a `.env` File**
    ```sh
    CLIENT_ID=XXXXXXX-XXXXXXXXXXXXXXXXX
    CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
    WEBHOOK_SIGNING_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
    ADMIN_MEMBER_ID=XXXXXXXXXXXXXXXX
    ```

5. **Retrieve Space and Collection IDs**
    - For each main space, get its `spaceId` and `collectionId` and `name` (the collection that contains sub spaces of
      the same
      space).
   ```sh
   [
        {
            spaceId: 'XXXXXXX',
            name: 'XXXXXXX',
            collectionId: 'XXXXXXX'
        },
        {
            spaceId: 'XXXXXXX',
            name: 'XXXXXXX',
            collectionId: 'XXXXXXX'
        },
        {
            spaceId: 'XXXXXXX',
            name: 'XXXXXXX',
            collectionId: 'XXXXXXX'
        },
        ...
    ]; 
   ```

6. **Fill in the Blanks in the Project**

7. **Run the Project**

## Environment Variables

Create a `.env` file in the root directory of the project and fill it with the following variables:

## Installation

1. Clone the repository:
   ```sh
   git clone <https://github.com/AliAghamiriBettermode/AutoJoinSubSpaces>
    ```
2. Install the dependencies:
   ```sh
   npm install
    ```
3. Run the project:
   ```sh
   npm start
    ```
4. The project will be running on `http://localhost:5000`.