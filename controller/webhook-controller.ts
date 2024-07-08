import {verifySignature} from "../utils/utils.js";
import BettermodeService from "../service/bettermode-service.js";

class WebhookController {
    static instance: WebhookController;

    webhookSignatureMiddleware(req: any, res: any, next: any) {
        const rawBody = req['rawBody'];
        const timestamp = parseInt(req.header('X-Bettermode-Request-Timestamp'), 10);
        const signature = req.header('X-Bettermode-Signature');
        try {
            if (rawBody && verifySignature({
                body: rawBody,
                timestamp,
                signature,
                secret: process.env.WEBHOOK_SIGNING_SECRET ?? ''
            })) {
                return next();
            }
        } catch (err) {
            console.error(err);
        }
        return res.status(403).json({error: 'The X-Bettermode-Signature is not valid.'});
    }

    async handleWebhook(body: any) {
        console.log('handleWebhook [1]');
        console.log(body);
        if (body.type === 'TEST') {
            return {
                "type": "TEST",
                "status": "SUCCEEDED",
                "data": {
                    "challenge": body.data.challenge
                }
            }
        }
        if (body.type !== 'SUBSCRIPTION') {
            return {};
        }
        switch (body.data.name) {
            case 'space_membership.created':
                await BettermodeService.getInstance().joinSubSpaces({
                    networkId: body.data.object.networkId,
                    memberId: body.data.object.memberId,
                    spaceId: body.data.object.spaceId
                });
                break;
            case 'space_membership.deleted':
                await BettermodeService.getInstance().leaveSubSpaces({
                    networkId: body.data.object.networkId,
                    memberId: body.data.object.memberId,
                    spaceId: body.data.object.spaceId
                });
                break;
            default:
                return {};
        }
    }

    static getInstance() {
        if (!WebhookController.instance) {
            WebhookController.instance = new WebhookController();
        }
        return WebhookController.instance;
    }
}

export default WebhookController;