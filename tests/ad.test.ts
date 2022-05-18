import {AdRecord} from "../records/ad.record";
import {pool} from "../utils/db";
import {AdEntity} from "../types";

const defaultObj = {
    name: 'Tester',
    description: 'Praca',
    url: 'https://interia.pl',
    price: 13,
    lat: 9022,
    lon: 93369,
};

afterAll(async ()=> {
    await pool.end();
})

test('AdRecord.getOne returns data from database for one entry.', async () => {
    const ad = await AdRecord.getOne('abc');

    expect(ad).toBeDefined();
    expect(ad.id).toBe('abc');
    expect(ad.name).toBe('Test Name');
});

test('AdRecord.getOne returns null from database for unexisting entry.', async () => {
    const ad = await AdRecord.getOne('---');

    expect(ad).toBeNull();
})

test('AdRecord.findAll returns array of found entries.', async () => {
    const ads = await AdRecord.getAll('a');
    expect(ads).not.toEqual([]);
    expect(ads[0].id).toBeDefined();
});

test('AdRecord.findAll returns empty array when searching dor something that does not exist.', async () => {
    const ads = await AdRecord.getAll('-------------------------');
    expect(ads).toEqual([]);
});

test('AdRecord.findAll returns smaller amount of data.', async () => {
    const ads = await AdRecord.getAll('');

    expect((ads[0] as AdEntity).price).toBeUndefined();
    expect((ads[0] as AdEntity).description).toBeUndefined();
});


test('AddRecord.insert returns new UUID', async () => {
    const ad = new AdRecord(defaultObj);

    await ad.insert();

    expect(ad.id).toBeDefined();
    expect(typeof ad.id).toBe('string');
});

test('AddRecord.insert inserts data to database.', async () => {
    const ad = new AdRecord(defaultObj);
    await ad.insert();

    const foundAd = await AdRecord.getOne(ad.id);

    expect(foundAd).toBeDefined();
    expect(foundAd).not.toBeNull();
    expect(foundAd.id).toBe(ad.id);
});