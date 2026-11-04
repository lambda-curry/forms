import assert from 'node:assert';
import { describe, it } from 'node:test';
import { pluralize } from './i18n';

describe('pluralize', () => {
  it('pluralizes English words correctly', () => {
    assert.strictEqual(pluralize('box', 'en'), 'boxes');
    assert.strictEqual(pluralize('category', 'en'), 'categories');
    assert.strictEqual(pluralize('dog', 'en'), 'dogs');
    assert.strictEqual(pluralize('watch', 'en'), 'watches');
    assert.strictEqual(pluralize('bus', 'en'), 'buses');
    assert.strictEqual(pluralize('wish', 'en'), 'wishes');
    // Simple words
    assert.strictEqual(pluralize('column', 'en'), 'columns');
  });

  it('does not pluralize for languages with no plural form', () => {
    assert.strictEqual(pluralize('数据', 'zh'), '数据'); // Chinese
    assert.strictEqual(pluralize('データ', 'ja'), 'データ'); // Japanese
  });

  it('falls back to appending s for other languages', () => {
    // Spanish has plurals. "dato" -> "datos".
    assert.strictEqual(pluralize('dato', 'es'), 'datos');

    // "papel" -> "papeles" in proper Spanish, but our fallback is naive
    // So we expect "papels" because we only improved 'en'.
    // If we passed 'en' it would handle 'papel' -> 'papels' anyway unless it hit sibilant?
    // 'papel' ends in 'l', so 's'.
    assert.strictEqual(pluralize('papel', 'es'), 'papels');
  });

  it('handles defaults when locale is missing', () => {
    // @ts-ignore
    assert.strictEqual(pluralize('cat', undefined), 'cats');
  });

  it('handles y endings correctly for English', () => {
    assert.strictEqual(pluralize('boy', 'en'), 'boys'); // Vowel + y -> s
    assert.strictEqual(pluralize('day', 'en'), 'days');
    assert.strictEqual(pluralize('city', 'en'), 'cities'); // Consonant + y -> ies
  });
});
