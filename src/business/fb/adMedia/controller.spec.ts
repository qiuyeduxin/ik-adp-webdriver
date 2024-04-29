import { Test, TestingModule } from '@nestjs/testing'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'

describe('AppController', () => {
  let appController: MediaController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [MediaService]
    }).compile()

    appController = app.get<MediaController>(MediaController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe({
        data: 'It is ok',
        dm_error: 0,
        error_msg: 'success'
      })
    })
  })
})
