package pl.edu.pwr.wordnetloom.domain.service.impl;

import java.util.List;
import javax.ejb.Local;
import javax.ejb.Remote;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.validation.Validator;
import pl.edu.pwr.wordnetloom.common.utils.ValidationUtils;
import pl.edu.pwr.wordnetloom.domain.exception.DomainNotFoundException;
import pl.edu.pwr.wordnetloom.domain.model.Domain;
import pl.edu.pwr.wordnetloom.domain.repository.DomainRepository;
import pl.edu.pwr.wordnetloom.domain.service.DomainServiceLocal;
import pl.edu.pwr.wordnetloom.domain.service.DomainServiceRemote;
import pl.edu.pwr.wordnetloom.lexicon.model.Lexicon;
import pl.edu.pwr.wordnetloom.partofspeech.model.PartOfSpeech;

@Stateless
@Local(DomainServiceLocal.class)
@Remote(DomainServiceRemote.class)
public class DomainServiceBean implements DomainServiceLocal {

    @Inject
    DomainRepository domainRepository;

    @Inject
    Validator validator;

    @Override
    public Domain findById(Long id) {
        final Domain domanin = domainRepository.findById(id);
        if (domanin == null) {
            throw new DomainNotFoundException();
        }
        return domanin;
    }

    @Override
    public List<Domain> findAllByLexiconAndPartOfSpeech(Lexicon lexicon, PartOfSpeech pos) {
        return domainRepository.findByLexiconAndPartOfSpeech(lexicon, pos);
    }

    @Override
    public List<Domain> findAll() {
        return domainRepository.findAll("id");
    }

    @Override
    public Domain add(Domain domain) {
        ValidationUtils.validateEntityFields(validator, domain);
        return domainRepository.persist(domain);
    }

    @Override
    public List<Domain> findAllWithFullNames() {
        return  domainRepository.findAllWithFullNames();
    }

}
