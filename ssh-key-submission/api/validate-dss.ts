import { Key } from 'sshpk';
import crypto from 'crypto';

export function validateDSSKey(privKey: string, pubKey: string): boolean {
    try {
        const parsedPrivKey = Key.parse(privKey, 'pem');
        const parsedPubKey = Key.parse(pubKey, 'ssh');
        if (parsedPrivKey.type !== 'dss' || parsedPubKey.type !== 'dss') return false;
        const publicFromPrivate = parsedPrivKey.toPublic();
        const privKeyFingerprint = publicFromPrivate.fingerprint('sha256').toString();
        const pubKeyFingerprint = parsedPubKey.fingerprint('sha256').toString();
        return privKeyFingerprint === pubKeyFingerprint;
    } catch (err) {
        return false;
    }
}