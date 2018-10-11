import { expect } from 'chai';
import { parseTextString, parseSymbolString } from '../parsers';
import { getModelsForSymbolString } from '../tableaux';

describe('lab2', () => {

    it('problem1', () => {

        let models = getModelsForSymbolString(
            'WeatherIsSunny -> ParkIsBeautiful, ' +
            'ParkIsBeautiful -> PeopleWalkDogs, ' +
            'PeopleWalkDogs -> ParkFullOfDogs, ' +
            'WeatherIsSunny & !ParkFullOfDogs');

        console.log(models);

        expect(models.length).to.equal(0);
    });

    it('problem2', () => {

        let models = getModelsForSymbolString([
            'PaulLikesApples -> PaulBuysApples',
            'WendyLikesApples -> WendyBuysApples',
            'SusanLikesApples -> SusanBuysApples',
            'WendyBuysApples -> BasketHasApples',
            'PaulLikesApples | WendyLikesApples | SusanLikesApples',
            'BasketHasApples'].join(', '));

        console.log(models);

        expect(models.length).to.not.equal(0);
    });

    it('problem3', () => {

        let models = getModelsForSymbolString([
            'YuehIsBlackmailed -> YuehPactsWithHarkonen',
            'YuehPactsWithHarkonen -> not YuehIsLoyal',
            'DukeAtreidesRewardsYueh <> YuehIsLoyal',
            'YuehIsBlackmailed & DukeAtreidesRewardsYueh'].join(', '));

        console.log(models);

        expect(models.length).to.equal(0);
    });

    it('problem4', () => {

        let models = getModelsForSymbolString([
            'AlfredTakesCar | AlfredTakesBus',
            'CarGoesWork <> CarHasGas',
            'AlfredGoesWork <> ( AlfredTakesCar & CarGoesWork )',
            'AlfredGoesWork <> ( AlfredTakesBus & BusGoesWork )',
            'AlfredTakesBus <> !CarGoesWork',
            'AlfredTakesCar <> CarHasGas',
            'BusGoesWork <> !CityHasTraffic',
            '!CarHasGas',
            'CityHasTraffic',
            'AlfredGoesWork'
        ].join(', '));

        console.log(models);

        expect(models.length).to.equal(0);
    });
});