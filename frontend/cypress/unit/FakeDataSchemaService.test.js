import FakeDataSchemaService from '../fixtures/FakeDataSchemaService';
import { CancellationTokenSource } from '../../src/utils/CancellationToken';

describe('FakeDataSchemaService', () => {
  describe('getEdgeTypes', () => {
    it('returns non-empty array', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getEdgeTypes();

      // Assert
      assert.isAbove(types.length, 0);
    });

    it('caches data correctly', async () => {
      // Arrange
      const service = new FakeDataSchemaService();
      const expected = await service.getEdgeTypes();

      // Act
      const types = await service.getEdgeTypes();

      // Assert
      assert.equal(types, expected);
    });

    it('returns entries with trimmed name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getEdgeTypes();

      // Assert
      for (const type of types) {
        assert.equal(type.name, type.name.trim());
      }
    });

    it('returns entries with non empty name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getEdgeTypes();

      // Assert
      for (const type of types) {
        assert.isAbove(type.name.length, 0);
      }
    });

    it('returns entries with unique name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getEdgeTypes();

      // Assert
      const takenNames = new Set();
      for (const type of types) {
        assert.isFalse(takenNames.has(type.name));
        takenNames.add(type.name);
      }
    });

    it('returns entries with correct number of properties', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getEdgeTypes();

      // Assert
      for (const type of types) {
        assert.isAtLeast(type.properties.length, 0);
        assert.isAtMost(type.properties.length, 20);
      }
    });

    it('returns entries with properties with trimmed name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getEdgeTypes();

      // Assert
      for (const type of types) {
        for (const prop of type.properties) {
          assert.equal(prop.name, prop.name.trim());
        }
      }
    });

    it('returns entries with properties with non empty name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getEdgeTypes();

      // Assert
      for (const type of types) {
        for (const prop of type.properties) {
          assert.isAbove(prop.name.length, 0);
        }
      }
    });

    it('returns entries with properties with unique name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getEdgeTypes();

      // Assert
      const takenNames = new Set();
      for (const type of types) {
        for (const prop of type.properties) {
          assert.isFalse(takenNames.has(prop.name));
          takenNames.add(prop.name);
        }
      }
    });

    it('throws error when canceled', async () => {
      // Arrange
      const service = new FakeDataSchemaService();
      const cts = new CancellationTokenSource();
      const cancellation = cts.token;
      cts.cancel();

      // Act & Assert
      try {
        await service.getEdgeTypes(cancellation);
        assert.isNotOk(true);
      } catch (CancellationError) {
        assert.isOk(true);
      }
    });
  });

  describe('getNodeTypes', () => {
    it('returns non-empty array', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getNodeTypes();

      // Assert
      assert.isAbove(types.length, 0);
    });

    it('caches data correctly', async () => {
      // Arrange
      const service = new FakeDataSchemaService();
      const expected = await service.getNodeTypes();

      // Act
      const types = await service.getNodeTypes();

      // Assert
      assert.equal(types, expected);
    });

    it('returns entries with trimmed name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getNodeTypes();

      // Assert
      for (const type of types) {
        assert.equal(type.name, type.name.trim());
      }
    });

    it('returns entries with non empty name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getNodeTypes();

      // Assert
      for (const type of types) {
        assert.isAbove(type.name.length, 0);
      }
    });

    it('returns entries with unique name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getNodeTypes();

      // Assert
      const takenNames = new Set();
      for (const type of types) {
        assert.isFalse(takenNames.has(type.name));
        takenNames.add(type.name);
      }
    });

    it('returns entries with correct number of properties', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getNodeTypes();

      // Assert
      for (const type of types) {
        assert.isAtLeast(type.properties.length, 0);
        assert.isAtMost(type.properties.length, 20);
      }
    });

    it('returns entries with properties with trimmed name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getNodeTypes();

      // Assert
      for (const type of types) {
        for (const prop of type.properties) {
          assert.equal(prop.name, prop.name.trim());
        }
      }
    });

    it('returns entries with properties with non empty name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getNodeTypes();

      // Assert
      for (const type of types) {
        for (const prop of type.properties) {
          assert.isAbove(prop.name.length, 0);
        }
      }
    });

    it('returns entries with properties with unique name', async () => {
      // Arrange
      const service = new FakeDataSchemaService();

      // Act
      const types = await service.getNodeTypes();

      // Assert
      const takenNames = new Set();
      for (const type of types) {
        for (const prop of type.properties) {
          assert.isFalse(takenNames.has(prop.name));
          takenNames.add(prop.name);
        }
      }
    });

    it('throws error when canceled', async () => {
      // Arrange
      const service = new FakeDataSchemaService();
      const cts = new CancellationTokenSource();
      const cancellation = cts.token;
      cts.cancel();

      // Act & Assert
      try {
        await service.getNodeTypes(cancellation);
        assert.isNotOk(true);
      } catch (CancellationError) {
        assert.isOk(true);
      }
    });
  });
});
