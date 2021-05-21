import { ArgumentError } from '../../../src/shared/errors';
import { FilterCondition } from '../../../src/shared/queries';
import FilterConditionVisitorMock from '../../fixtures/filter/FilterConditionVisitorMock';

describe('FilterConditionVisitor', () => {
  describe(`visit`, () => {
    it('throws exception when visiting condition without rule property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{};

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting condition with non-string rule property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>(<unknown>{
        rule: 123,
      });

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting of-type condition without type property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = {
        rule: 'of-type',
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting of-type condition non-string type property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'of-type',
        type: 123,
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting match-property condition without property property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'match-property',
        value: 'def',
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting match-property condition without value property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'match-property',
        property: 'avc',
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting match-property condition with non-string property property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'match-property',
        property: 123,
        value: 'def',
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting match-all condition without filter property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'all',
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting match-all condition with non-array filter property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'all',
        filters: 'string',
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting match-all condition with filter property that contains non-filter conditions', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'all',
        filters: ['abc'],
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting match-any condition without filter property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'any',
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting match-any condition with non-array filter property', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'any',
        filters: 'string',
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });

    it('throws exception when visiting match-any condition with filter property that contains non-filter conditions', async () => {
      // Arrange
      const subject = new FilterConditionVisitorMock();
      const query: FilterCondition = <FilterCondition>{
        rule: 'any',
        filters: ['abc'],
      };

      // Act
      const act = () => subject.visit(query);

      // Assert
      expect(act).toThrow(ArgumentError);
    });
  });
});
