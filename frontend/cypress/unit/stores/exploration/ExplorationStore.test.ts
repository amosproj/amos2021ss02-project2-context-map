import ExplorationStore from '../../../../src/stores/exploration/ExplorationStore';
import {
  ExplorationAnswer,
  ExplorationWeight,
} from '../../../../src/stores/exploration';

describe('ExplorationStore', () => {
  let explorationStore: ExplorationStore;
  let dummyAnswers: ExplorationAnswer[];

  function getSampleWeight(weight = 0): ExplorationWeight {
    return {
      C: weight,
      BC: weight,
      H: weight,
      R: weight,
      SP: weight,
      L: weight,
      P: weight,
    };
  }

  beforeEach(() => {
    explorationStore = new ExplorationStore();

    dummyAnswers = [
      { text: 'A', weight: getSampleWeight(1) },
      { text: 'B', weight: getSampleWeight(2) },
      { text: 'C', weight: getSampleWeight(3) },
    ];
  });

  describe('Answers', () => {
    it('should start with an empty array', () => {
      expect(explorationStore.getValue()).to.have.length(0);
    });

    it('should be possible to add values', () => {
      dummyAnswers.forEach((answer) => explorationStore.addAnswer(answer));

      expect(explorationStore.getValue()).to.have.length(dummyAnswers.length);
      expect(explorationStore.getValue()).to.have.members(dummyAnswers);
    });

    it('should be possible to delete values', () => {
      // Act 1: add items
      dummyAnswers.forEach((answer) => explorationStore.addAnswer(answer));
      // Act 2: remove item
      explorationStore.removeAnswer(dummyAnswers[1]);

      // Assert 1: one item removed
      expect(explorationStore.getValue()).to.have.length(
        dummyAnswers.length - 1
      );
      // Assert 2: all but the removed item is in the list
      expect(explorationStore.getValue()).to.have.members([
        dummyAnswers[0],
        dummyAnswers[2],
      ]);

      // Act 3: remove all other items
      explorationStore.removeAnswer(dummyAnswers[0]);
      explorationStore.removeAnswer(dummyAnswers[2]);
      // Assert 3: all items remove
      expect(explorationStore.getValue()).to.have.length(0);
    });

    it('should remove all items on reset', () => {
      dummyAnswers.forEach((answer) => explorationStore.addAnswer(answer));
      explorationStore.reset();
      expect(explorationStore.getValue()).to.have.length(0);
    });
  });

  describe('Scores', () => {
    it('should return empty score if store is empty', () => {
      expect(explorationStore.getScoreValue()).to.be.deep.eq(
        getSampleWeight(0)
      );
    });

    it('should return summed up score', () => {
      // Act 1: add items
      dummyAnswers.forEach((answer) => explorationStore.addAnswer(answer));
      expect(explorationStore.getScoreValue()).to.be.deep.eq(
        getSampleWeight(6)
      );
    });
  });
});
