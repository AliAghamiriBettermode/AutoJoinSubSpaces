import got from "got";
import {encodeBase64} from "../utils/utils.js";
import BlueBird from "bluebird";

class BettermodeService {
    static instance: BettermodeService;
    static spaces: { spaceId: string, name: string, collectionId: string }[] = []; // TODO: Fill this with actual data
    static clientId = process.env.CLIENT_ID || ''; // TODO: Fill this with actual data or use environment variables
    static clientSecret = process.env.CLIENT_SECRET || ''; // TODO: Fill this with actual data or use environment variables
    static adminMemberId = process.env.ADMIN_MEMBER_ID || ''; // TODO: Fill this with actual data or use environment variables

    async getMemberAccessToken(networkId: string) {
        try {
            const response = await got.post("https://api.bettermode.com", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${encodeBase64(`${BettermodeService.clientId}:${BettermodeService.clientSecret}`)}`
                },
                json: {
                    query: `query{
              limitedToken(context: NETWORK, entityId: "${networkId}", networkId: "${networkId}", impersonateMemberId:"${BettermodeService.adminMemberId}"){
                  accessToken
              }
            }`,
                    variables: {}
                }
            });
            return JSON.parse(response.body).data.limitedToken.accessToken;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async getCollectionSpaces(collectionId: string, accessToken: string): Promise<{
        id: string,
        name: string
    }[] | null> {
        const response = await got.post("https://api.bettermode.com", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            json: {
                query: `query Collection {
                            collection(id: "${collectionId}") {
                                spaces(limit: 10) {
                                    nodes {
                                        id
                                        name
                                    
                                    }
                                }
                            }
                        }`,
                variables: {}
            }
        });
        if (!response) {
            return null;
        }
        return JSON.parse(response.body).data.collection.spaces.nodes;
    }

    async joinSubSpaces(data: { networkId: string, memberId: string, spaceId: string }) {
        const {networkId, memberId, spaceId} = data;
        const accessToken = await this.getMemberAccessToken(networkId);
        if (!accessToken) {
            return false;
        }
        // const subSpaces = BettermodeService.spaceMap[spaceId] ?? [];
        const space = BettermodeService.spaces.find(space => space.spaceId === spaceId);
        if (!space) {
            return false;
        }
        const subSpaces = await this.getCollectionSpaces(space.collectionId, accessToken);
        if (!subSpaces) {
            return false;
        }
        try {
            await BlueBird.mapSeries(subSpaces, async (subSpace) => {
                await got.post("https://api.bettermode.com", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`
                    },
                    json: {
                        query: `mutation AddSpaceMembers {
                                    addSpaceMembers(
                                        input: { memberId: "${memberId}" }
                                        spaceId: "${subSpace.id}"
                                    ) {
                                        member {
                                            id
                                            name
                                        }
                                        role {
                                            id
                                        }
                                    }
                                }`,
                        variables: {}
                    }
                });
            });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    static getInstance() {
        if (!BettermodeService.instance) {
            BettermodeService.instance = new BettermodeService();
        }
        return BettermodeService.instance;
    }
}

export default BettermodeService;