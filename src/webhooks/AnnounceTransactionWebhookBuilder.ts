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

    private readonly webhook: AnnounceTransactionWebhookDTO;

    constructor(public readonly hash: string,
                public readonly signerPublicKey: string) {
        this.webhook = {action: 'AnnounceTransaction',
            data: {
                hash: this.hash,
                signerPublicKey: this.signerPublicKey
            }
        };
    }

    /**
     * Build the webhook DTO
     */
    build(): AnnounceTransactionWebhookDTO {
        return this.webhook;
    }
}
