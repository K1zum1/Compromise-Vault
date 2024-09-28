import { Key } from 'sshpk';
import crypto from 'crypto';

export function validateEd25519Key(privKey: string, pubKey: string): boolean {
    try {
        const parsedPrivKey = Key.parse(privKey, 'pem');
        const parsedPubKey = Key.parse(pubKey, 'ssh');
        if (parsedPrivKey.type !== 'ed25519' || parsedPubKey.type !== 'ed25519') return false;
        const publicFromPrivate = parsedPrivKey.toPublic();
        const privKeyFingerprint = publicFromPrivate.fingerprint('sha256').toString();
        const pubKeyFingerprint = parsedPubKey.fingerprint('sha256').toString();
        return privKeyFingerprint === pubKeyFingerprint;
    } catch (err) {
        return false;
    }
}
