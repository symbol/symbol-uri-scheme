export interface WebhookDTO {
    action: string;
    data: object;
}

/**
 * URI Scheme interface
 */
export interface IWebhookBuilder {
    build(): WebhookDTO;
}
