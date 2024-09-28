import { Key } from 'sshpk';
import crypto from 'crypto';

export function validateRSAKey(privKey: string, pubKey: string): boolean {
    try {
        const parsedPrivKey = Key.parse(privKey, 'pem');
        const parsedPubKey = Key.parse(pubKey, 'ssh');
        if (parsedPrivKey.type !== 'rsa' || parsedPubKey.type !== 'rsa') return false;
        const publicFromPrivate = parsedPrivKey.toPublic();
        const privKeyFingerprint = publicFromPrivate.fingerprint('sha256').toString();
        const pubKeyFingerprint = parsedPubKey.fingerprint('sha256').toString();
        return privKeyFingerprint === pubKeyFingerprint;
    } catch (err) {
        return false;
    }
}
