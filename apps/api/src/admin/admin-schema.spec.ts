import { QueryRunner, Table, TableColumn } from 'typeorm';
import { repairAdminSchema } from './admin-schema';

describe('administrator schema repair', () => {
  function setup(columnNames: string[]) {
    const table = new Table({
      name: 'users',
      columns: columnNames.map(
        (name) => new TableColumn({ name, type: 'datetime' }),
      ),
    });
    const getTable = jest.fn().mockResolvedValue(table);
    const addColumns = jest
      .fn<Promise<void>, [Table, TableColumn[]]>()
      .mockImplementation((_table: Table, columns: TableColumn[]) => {
        table.columns.push(...columns);
        return Promise.resolve();
      });
    const runner = { getTable, addColumns } as unknown as QueryRunner;
    return { runner, getTable, addColumns };
  }

  it('adds only the three nullable administrator columns and can be repeated', async () => {
    const { runner, addColumns } = setup(['id']);
    await expect(repairAdminSchema(runner)).resolves.toEqual([
      'blockedAt',
      'blockedReason',
      'recoveryRequestedAt',
    ]);
    const columns = addColumns.mock.calls[0]?.[1] as TableColumn[];
    expect(columns.every((column) => column.isNullable)).toBe(true);
    expect(
      columns.find((column) => column.name === 'blockedReason'),
    ).toMatchObject({ type: 'varchar', length: '255' });
    await expect(repairAdminSchema(runner)).resolves.toEqual([]);
    expect(addColumns).toHaveBeenCalledTimes(1);
  });

  it('repairs a partially updated table without replacing existing columns', async () => {
    const { runner } = setup(['id', 'blockedAt']);
    await expect(repairAdminSchema(runner)).resolves.toEqual([
      'blockedReason',
      'recoveryRequestedAt',
    ]);
  });

  it('refuses to create a missing users table', async () => {
    const { runner, getTable, addColumns } = setup([]);
    getTable.mockResolvedValue(undefined);
    await expect(repairAdminSchema(runner)).rejects.toThrow(
      'users table is missing',
    );
    expect(addColumns).not.toHaveBeenCalled();
  });
});
