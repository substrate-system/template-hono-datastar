import dom from '@substrate-system/dom'
import { test } from '@substrate-system/tapzero'

test('exmaple', t => {
    const el = dom.waitFor('body div')
    t.ok(el, 'found an element')
})
