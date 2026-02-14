import i18n from '../i18n';

export const mapErrorCodeToMessage = (errorCode) => {
    const messages = {
        400: i18n.t('error'),
        401: i18n.t('login_error'),
        403: i18n.t('error'),
        404: i18n.t('api_error_404'),
        500: i18n.t('api_error_500'),
    };
    return messages[errorCode] || i18n.t('unexpected_error');
};
