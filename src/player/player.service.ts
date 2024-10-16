import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, map } from 'rxjs';
import { Players } from 'src/entities/Players';
import { Submissions } from 'src/entities/Submissions';
import { CreateSubmissionDto } from 'src/submission/dto/create-submission.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Players)
    private playersRepository: Repository<Players>,
    @InjectRepository(Submissions)
    private submissionsRepository: Repository<Submissions>,
  ) {}

  async create(dto: CreateSubmissionDto) {
    const { bjname, titleNo } = dto;
    let allComments = [];
    let currentPage = 1;
    let lastPage = 1;

    do {
      const afComments = await lastValueFrom(
        this.httpService
          .get(`https://chapi.sooplive.co.kr/api/${bjname}/title/${titleNo}/comment?page=${currentPage}`)
          .pipe(map((response) => response.data)),
      );

      if (currentPage === 1) lastPage = afComments.meta.last_page;

      const fixComments = afComments.data.map((comment) => {
        return {
          pCommentNo: comment.p_comment_no,
          upCount: comment.like_cnt,
        };
      });

      allComments = allComments.concat(fixComments);
      currentPage++;
    } while (currentPage <= lastPage);

    allComments.sort((a, b) => a.pCommentNo - b.pCommentNo);

    const submissions = await this.submissionsRepository.find();
    submissions.sort((a, b) => a.pCommentNo - b.pCommentNo);

    for (const sub of submissions) {
      const matchingComment = allComments.find((comment) => comment.pCommentNo === sub.pCommentNo);

      if (matchingComment) {
        const isJType = sub.mbti.slice(-1).toLowerCase() === 'j';
        const existingPlayer = await this.playersRepository.findOne({
          where: { submission: { id: sub.id } },
        });

        if (existingPlayer) {
          existingPlayer.nickname = sub.userNick;
          existingPlayer.afreecatvId = sub.userId;
          existingPlayer.minecraftId = sub.minecraftId;
          existingPlayer.pOrJ = isJType;
          existingPlayer.upCount = matchingComment.upCount;
          await this.playersRepository.save(existingPlayer);
        } else {
          const newPlayer = this.playersRepository.create({
            nickname: sub.userNick,
            afreecatvId: sub.userId,
            minecraftId: sub.minecraftId,
            pOrJ: isJType,
            upCount: matchingComment.upCount,
            submission: sub,
          });
          await this.playersRepository.save(newPlayer);
        }
      }
    }
  }

  async getTeams() {
    const teamP = await this.playersRepository.find({
      where: { pOrJ: false },
      order: { upCount: 'DESC', id: 'ASC' },
      take: 17,
    });

    const teamJ = await this.playersRepository.find({
      where: { pOrJ: true },
      order: { upCount: 'DESC', id: 'ASC' },
      take: 17,
    });

    return {
      teamP,
      teamJ,
    };
  }
}
