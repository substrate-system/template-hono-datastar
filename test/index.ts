import dom from '@substrate-system/dom'
import { test } from '@substrate-system/tapzero'

// Counter HTML template with Datastar attributes
const counterHTML = `
<div id="test-root" data-signals="{count: 0}">
    <span data-text="$count"></span>
    <button id="plus-btn" data-on:click="$count++">plus</button>
    <button id="minus-btn" data-on:click="$count--">minus</button>
</div>
`

// Set up the DOM before tests
function setupDOM () {
    document.body.innerHTML = counterHTML
}

// Load Datastar dynamically for tests
async function loadDatastar (): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'module'
        script.src = 'https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.7/bundles/datastar.js'
        script.onload = () => {
            // Give Datastar time to initialize
            setTimeout(resolve, 100)
        }
        script.onerror = reject
        document.head.appendChild(script)
    })
}

test('setup', async t => {
    setupDOM()
    await loadDatastar()
    t.ok(true, 'DOM and Datastar loaded')
})

test('counter displays initial value of 0', async t => {
    const countDisplay = dom.qs('[data-text="$count"]')
    t.ok(countDisplay, 'count display element exists')
    t.equal(countDisplay?.textContent, '0', 'initial count is 0')
})

test('plus button increments count', async t => {
    const plusBtn = dom.qs<HTMLButtonElement>('#plus-btn')
    t.ok(plusBtn, 'plus button exists')
    await dom.click(plusBtn!)
    await dom.sleep(50)  // wait for Datastar to update
    const countDisplay = dom.qs('[data-text="$count"]')
    t.equal(countDisplay?.textContent, '1', 'count incremented to 1')
})

test('minus button decrements count', async t => {
    const minusBtn = dom.qs<HTMLButtonElement>('#minus-btn')
    t.ok(minusBtn, 'minus button exists')
    await dom.click(minusBtn!)
    await dom.sleep(50)  // wait for Datastar to update
    const countDisplay = dom.qs('[data-text="$count"]')
    t.equal(countDisplay?.textContent, '0', 'count decremented to 0')
})
