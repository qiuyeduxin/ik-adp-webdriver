import { Test, TestingModule } from '@nestjs/testing'
import { AutoAuthController } from './autoAuth.controller'

describe('AutoAuthController', () => {
  let controller: AutoAuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoAuthController]
    }).compile()

    controller = module.get<AutoAuthController>(AutoAuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
