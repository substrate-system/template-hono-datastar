// Datastar is loaded via CDN in index.html - the npm package is no longer published
// See: https://github.com/starfederation/datastar/issues/742
import Debug from '@substrate-system/debug'

const debug = Debug('example')
if (import.meta.env.DEV || import.meta.env.MODE === 'staging') {
    localStorage.setItem('DEBUG', 'example,exmample:*')
} else {
    localStorage.removeItem('DEBUG')
}

debug('hello from client-side JS')

// this file is empty...
