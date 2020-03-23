import {IWebhookBuilder, WebhookDTO} from './IWebhookBuilder';

interface AnnounceTransactionWebhookDTO extends WebhookDTO {
    action: 'AnnounceTransaction';
    data: {
        'hash': string,
        'signerPublicKey': string
    };
}

/**
 * Constructor.
 * @param {webhook} AnnounceTransactionWebhookDTO.
 */
export class AnnounceTransactionWebhookBuilder implements IWebhookBuilder {

    constructor(public readonly hash: string,
                public readonly signerPublicKey: string) {
    }

    /**
     * Build the webhook DTO
     */
    build(): AnnounceTransactionWebhookDTO {
        return {action: 'AnnounceTransaction',
            data: {
                hash: this.hash,
                signerPublicKey: this.signerPublicKey
            }
        };
    }
}
