/*
    Copyright (C) 2011 Łukasz Jastrzębski, Paweł Koczan, Michał Marcińczuk,
                       Bartosz Broda, Maciej Piasecki, Adam Musiał,
                       Radosław Ramocki, Michał Stanek
    Part of the WordnetLoom

    This program is free software; you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation; either version 3 of the License, or (at your option)
any later version.

    This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
or FITNESS FOR A PARTICULAR PURPOSE.

    See the LICENSE and COPYING files for more details.
 */
package pl.edu.pwr.wordnetloom.client.plugins.relations.da;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JFrame;
import pl.edu.pwr.wordnetloom.client.systems.enums.RelationTypes;
import pl.edu.pwr.wordnetloom.client.systems.enums.WorkState;
import pl.edu.pwr.wordnetloom.client.systems.managers.DomainManager;
import pl.edu.pwr.wordnetloom.client.systems.managers.LexiconManager;
import pl.edu.pwr.wordnetloom.client.systems.misc.NodeDrawer;
import pl.edu.pwr.wordnetloom.client.systems.progress.AbstractProgressThread;
import pl.edu.pwr.wordnetloom.client.systems.progress.ProgressFrame;
import pl.edu.pwr.wordnetloom.client.utils.Common;
import pl.edu.pwr.wordnetloom.client.utils.RemoteUtils;
import pl.edu.pwr.wordnetloom.model.wordnet.Domain;
import pl.edu.pwr.wordnetloom.model.wordnet.PartOfSpeech;
import pl.edu.pwr.wordnetloom.model.wordnet.RelationType;
import pl.edu.pwr.wordnetloom.model.wordnet.Sense;
import pl.edu.pwr.wordnetloom.model.wordnet.Synset;
import pl.edu.pwr.wordnetloom.model.wordnet.SynsetRelation;

/**
 * klasa pośrednicząca w wymianie danych
 *
 * @author Max
 */
public class RelationsDA {

    static String RELATION_TREE_BUILDING = "Budowanie drzewa relacji";
    static String RELATION_TREE_DATA_READING = "Odczyt danych";

    /**
     * prywatny konstruktor, aby nikogo nie krocilo stworzenie obiektu tej klasy
     * :)
     */
    private RelationsDA() {
        /**
         *
         */
    }

    /**
     * odczytane listy synsetow spelnijacych filtr
     *
     * @param filterText - filtr nazw
     * @param status - status do filtrowania (dochodzi do tego 0- wszystko)
     * @param domainStr - domena do filtrowania
     * @param relationType - typ relacji jakie muszą byc zdefiniowane dla
     * wynikowych synsetow
     * @param limitSize - maksymalna liczba zwroconych elementów
     * @param lexicon
     * @return kolekcja z danymi
     */
    static public Collection<Synset> getSynsets(String filterText, int status, String domainStr, RelationType relationType, int limitSize, List<Long> lexicon) {
        return RelationsDA.getSynsets(filterText, status, domainStr, relationType, limitSize, limitSize, lexicon);
    }

    /**
     * odczytane listy synsetow spelnijacych filtr, dodane filtrowanie po części
     * mowy
     *
     * @param filterText - filtr nazw
     * @param status - status do filtrowania (dochodzi do tego 0- wszystko)
     * @param domainStr - domena do filtrowania
     * @param relationType - typ relacji jakie muszą byc zdefiniowane dla
     * wynikowych synsetow
     * @param limitSize - maksymalna liczba zwroconych elementów
     * @param posIndex - indeks części mowy (-1 wszystkie, 0 nieznany, itd.
     * zgodnie z enum Pos)
     * @param lexicons
     * @return kolekcja z danymi
     */
    static public Collection<Synset> getSynsets(String filterText, int status, String domainStr, RelationType relationType, int limitSize, int posIndex, List<Long> lexicons) {
        Collection<WorkState> workStates = null;
        if (status == 0) {      // wszystko
            // nic nie robi, daje null
        } else if (status == 1) { // przetworzone i czesciowo przetworzone
            workStates = new ArrayList<WorkState>();
            workStates.add(WorkState.WORKING);
            workStates.add(WorkState.TODO);
        } else if (status > 1) {
            workStates = new ArrayList<WorkState>();
            workStates.add(WorkState.values()[status - 2]); // uwzglednienie all ktorego normalnie nie ma, dlatego -2
        }
        Domain domain = null;
        if (domainStr != null) {
            domain = DomainManager.getInstance().decode(domainStr);
        }
        List<Synset> synsets = RemoteUtils.synsetRemote.dbFastGetSynsets(filterText, domain, relationType, limitSize, posIndex, lexicons);

//		// Odrzyć synsety z opisem systemowym, tj. "!(...)!"
//		Collection <Synset> synsetsf = new ArrayList<Synset>();
//		for (Synset synset : synsets)
//			if (!(synset.getUnitsStr().startsWith("!") && synset.getUnitsStr().endsWith("!")))
//					synsetsf.add(synset);
        return synsets;
    }

    /**
     * przeniesienie jednostek do istniejacego synsetu
     *
     * @param mainSynset - glowny synset
     * @param selectedUnits - zaznaczone jednostki
     * @param descSynset - docelowy synset
     */
    public static void moveUnitsToExistenSynset(Synset mainSynset, Collection<Sense> selectedUnits, Synset descSynset) {

        for (Sense unit : selectedUnits) {
            RemoteUtils.unitAndSynsetRemote.dbDeleteConnection(unit, mainSynset);
            RemoteUtils.unitAndSynsetRemote.dbAddConnection(unit, descSynset, false);
        }
        // NOWY WLASCICIEL
//		mainSynset.setOwner(Synset.getDefaultOwner());
//		descSynset.setOwner(Synset.getDefaultOwner());
//		RemoteUtils.synsetRemote.updateSynset(mainSynset);
//		RemoteUtils.synsetRemote.updateSynset(descSynset);
        // KONIEC NOWY WLASCICIEL
    }

    /**
     * ustawienie poprawnosci relacji
     *
     * @param relation - relacja
     * @param valid - poprawnosc
     */
    @Deprecated
    public static void setValid(SynsetRelation relation, boolean valid) {
        // zapisanie stanu relacji
//		relation.setValid(new Boolean(valid));
//		RemoteUtils.synsetRelationRemote.dbUpdate(relation);

//		if (!valid) { // nie jest poprawna, wiec zmieniamy satus
//			Synset synset=relation.getParentItem();
//			synset = RemoteUtils.synsetRemote.dbRefresh(synset);
//			synset.setStatus(WorkState.MISTAKE);
//			RemoteUtils.synsetRemote.dbUpdate(synset);
//		}
    }

    /**
     * usuniecie relacji
     *
     * @param relation - relacja do usuniecia
     */
    public static void delete(SynsetRelation relation) {
        RemoteUtils.synsetRelationRemote.dbDelete(relation);
    }

    /**
     * sprawdzenie czy podana relacja już istnieje
     *
     * @param parent - element nadrzedny
     * @param child - element podrzedny
     * @param rel - typ relacji
     * @return TRUE jesli relacja istnieje
     */
    public static boolean checkIfRelationExists(Synset parent, Synset child, RelationType rel) {
        return RemoteUtils.synsetRelationRemote.dbRelationExists(parent, child, rel);
    }

//	public static boolean checkIfRelationExists(Long parent, Long child, Long rel) {
//		return RemoteUtils.synsetRelationRemote.dbRelationExists(parent,child,rel);
//	}
    /**
     * utworzenie relacji
     *
     * @param parent - element nadrzedny
     * @param child - element podrzedny
     * @param rel - typ relacji
     */
    public static void makeRelation(Synset parent, Synset child, RelationType rel) {
        if (parent == null || child == null || parent.getId() == -1 || child.getId() == -1) {
            return;
        }

        RemoteUtils.synsetRelationRemote.dbMakeRelation(parent, child, rel);
    }

    /**
     * odczytanie pierwszej jednostki synsetu
     *
     * @param synset - synset
     * @return pierwsza jednostka
     */
    public static Sense getFirstUnit(Synset synset) {
        Collection<Sense> units = RemoteUtils.lexicalUnitRemote.dbFullGetUnits(synset, 1, LexiconManager.getInstance().getLexicons());
        for (Sense unit : units) {
            return unit;
        }
        return null;
    }

    /**
     * utworzenie nowego synsetu
     *
     * @return nowy synset
     */
    public static Synset newSynset() {
        Synset newSynset = new Synset();
        newSynset.setSplit(1);
        return RemoteUtils.synsetRemote.updateSynset(newSynset);
    }

    /**
     * odczytanie czesci mowy synsetu
     *
     * @param synset - synset
     * @param lexicons
     * @return czesc mowy
     */
    public static PartOfSpeech getPos(Synset synset, List<Long> lexicons) {
        return RemoteUtils.synsetRemote.dbGetPos(synset, lexicons);
    }

    /**
     * odczytanie jednostek synsetu
     *
     * @param synset - sysnet
     * @param lexicons
     * @return jednostki synsetu
     */
    public static Collection<Sense> getUnits(Synset synset, List<Long> lexicons) {
        return RemoteUtils.synsetRemote.dbFastGetUnits(synset, lexicons);
    }

    /**
     * odczytanie jednostek synsetu
     *
     * @param synset - synset
     * @param ignoredUnits - lista jednostke ktore maja zostac zignorowane przy
     * oczycie
     * @param lexicons
     * @return jednostki synsetu
     */
    public static Collection<Sense> getUnits(Synset synset, Collection<Sense> ignoredUnits, List<Long> lexicons) {
        Collection<Sense> temp = getUnits(synset, lexicons);
        Collection<Sense> result = new ArrayList<Sense>();
        // sprawdzenie wszytkich jednostek
        for (Sense synsetUnit : temp) {
            boolean found = false;
            for (Sense ignoredUnit : ignoredUnits) {
                if (synsetUnit.equals(ignoredUnit)) { // czy nie sa takie same
                    found = true;
                    break;
                }
            }
            if (!found) {
                result.add(synsetUnit);
            }
        }
        return result;
    }

    /**
     * odczytanie relacji odwrotnej
     *
     * @param rel - relacja
     * @return relacja odwrotna
     */
    public static RelationType getReverseRelation(RelationType rel) {
        RelationType reverse = RemoteUtils.relationTypeRemote.dbGetReverseByRelationType(rel);
        return RemoteUtils.relationTypeRemote.dbGet(reverse.getId());
    }

    /**
     * odczytanie opisu relacji
     *
     * @param rel - relacja dla ktorej ma zostac odczytany opis
     * @return pelna nazwa relacji
     */
    public static String getRelationName(RelationType rel) {
        if (rel != null) {
            if (rel.getParent() != null) { // ma rodzica
                RelationType parent = RemoteUtils.relationTypeRemote.dbGet(rel.getParent().getId());
                parent = RelationTypes.get(parent.getId()).getRelationType();

                if (parent != null) {
                    return parent.getName() + " / " + rel.getName();
                }
            }
            return RelationTypes.getFullNameFor(rel.getId());
        }
        return null;
    }

    /**
     * odczytanie wszystkich typow relacji dla danego synsetu ktorymi jest
     * zwiazany z innymi
     *
     * @param synset - synset
     * @return lista typow relacji
     */
    public static Collection<RelationType> getRelationsTypes(Synset synset) {
        Collection<RelationType> relations = null;
        if (synset != null) {
            relations = RemoteUtils.synsetRelationRemote.dbGetRelationTypesOfSynset(synset);
//			for (RelationType typeDTO : relations) {
//				typeDTO = RemoteUtils.relationTypeRemote.dbGetFullName(typeDTO);
//			}
        } else {
            relations = new ArrayList<RelationType>();
        }

        return relations;
    }

//	/**
//	 * odczytanie wszystkich relacji w jakich wystepuje synset
//	 * @param synset - synset
//	 * @return lista informacji o relacjach
//	 */
//	public static Collection<SynsetsRelationsDC> getRelations(Synset synset) {
//		Collection<SynsetsRelationsDC> relations=SynsetsRelationsDC.dbGetRelations(synset,null,SynsetsRelationsDC.IS_PARENT, false);
//		relations.addAll(SynsetsRelationsDC.dbGetRelations(synset,null,SynsetsRelationsDC.IS_CHILD, false));
//		return relations;
//	}
//	/**
//	 * odczytanie wszystkich relacji w jakich wystepuje synset, odczytywany jest jedynie ID obiektu
//	 * oraz jego opis
//	 * @param synset - synset
//	 * @param hideAutoReverse
//	 * @return lista informacji o relacjach
//	 */
//	public static Collection<SynsetsRelationsDC> getFastRelations(Synset synset, boolean hideAutoReverse) {
//		Collection<SynsetsRelationsDC> relations=SynsetsRelationsDC.dbFastGetRelations(synset,SynsetsRelationsDC.IS_PARENT, false);
//		relations.addAll(SynsetsRelationsDC.dbFastGetRelations(synset,SynsetsRelationsDC.IS_CHILD, hideAutoReverse));
//		return relations;
//	}
    static void buildRelationsTreeIdx(Long synsetId, Collection<SynsetRelation> relations, Collection<Long> usedSynsetsID, ArrayList<Long> idx) {
        if (synsetId == null) {
            return;
        }
        idx.add(synsetId);
        if (!usedSynsetsID.contains(synsetId)) {
            usedSynsetsID.add(synsetId);

            for (SynsetRelation item : relations) {
                if (item.getSynsetFrom().getId().longValue() == synsetId.longValue()) {
                    buildRelationsTreeIdx(item.getSynsetTo().getId(), relations, usedSynsetsID, idx); // zbudowanie podrzednego
                }
            }
        }
    }

    /**
     * zbudowanie drzewa relacji synsetow
     *
     * @param synsetId
     * @param relations
     * @param usedSynsetsID
     * @param synsetsDescriptions
     * @param progress - okno z informacja o postepie
     * @param refreshProgressDepth
     * @return drzewo relacji synsetow
     */
    static NodeDrawer buildRelationsTree(Long synsetId, Collection<SynsetRelation> relations, Collection<Long> usedSynsetsID, Map<Long, String> synsetsDescriptions, ProgressFrame progress, int refreshProgressDepth) {
        if (synsetId == null) {
            return new NodeDrawer("---");
        }
        final String desc = synsetsDescriptions.get(synsetId);
        if (desc == null) {
            return new NodeDrawer("---");
        }
        NodeDrawer mainNode = new NodeDrawer(desc);
        if (refreshProgressDepth > 0) {
            progress.setProgressParams(100, 100, desc);
        }
        mainNode.setTag(synsetId);
        if (!usedSynsetsID.contains(synsetId)) {
            usedSynsetsID.add(synsetId);

            for (SynsetRelation item : relations) {
                if (item.getSynsetFrom().getId().longValue() == synsetId.longValue()) {
                    NodeDrawer subItem = buildRelationsTree(item.getSynsetTo().getId(), relations, usedSynsetsID, synsetsDescriptions, progress, refreshProgressDepth - 1); // zbudowanie podrzednego
                    mainNode.addNode(subItem); // dodanie do drzewa
                    if (progress.isCanceled()) {
                        break;
                    }
                }
            }
        }
        return mainNode;
    }

    /**
     * zbudowanie drzewa relacji synsetow
     *
     * Funkcja zmodyfikowana w celu redukcji pobieranych rekordów synset
     * description. Pobierane są tylko potrzebne ID, zamiast całej listy.
     *
     * @param parent
     * @param synset
     * @param relationType
     * @param lexicons
     * @return drzewo relacji synsetow
     */
    public static NodeDrawer buildRelationsTree(JFrame parent, final Synset synset, final RelationType relationType, final List<Long> lexicons) {
        AbstractProgressThread progress = new AbstractProgressThread(parent, RELATION_TREE_BUILDING, null, true) {
            @Override
            protected void mainProcess() {
                progress.setGlobalProgressParams(1, 2);
                progress.setProgressParams(0, 100, RELATION_TREE_DATA_READING);

                // odczytanie relacji aby miec w buforze
                Collection<SynsetRelation> relations = RemoteUtils.synsetRelationRemote.dbFastGetRelations(relationType);

                // przerobienie kolekcji na hashmape
                HashMap<Long, ArrayList<Long>> map = new HashMap<Long, ArrayList<Long>>();
                for (SynsetRelation item : relations) {
                    ArrayList<Long> values = map.get(item.getSynsetFrom().getId());
                    if (values == null) {
                        values = new ArrayList<Long>();
                        map.put(item.getSynsetFrom().getId(), values);
                    }
                    values.add(item.getSynsetTo().getId());
                }

                // generate synsets IDx
                ArrayList<Long> idx = new ArrayList<Long>();
                buildRelationsTreeIdx(synset != null ? synset.getId() : null, relations, new ArrayList<Long>(), idx);

                Map<Long, String> synsetsDescriptions = RemoteUtils.synsetRemote.dbGetSynsetsDescriptionIdx(idx, lexicons);

                this.tag = buildRelationsTree(synset != null ? synset.getId() : null, relations, new ArrayList<Long>(), synsetsDescriptions, progress, 2);
            }
        };
        if (progress.getTag() != null) {
            return (NodeDrawer) progress.getTag();
        }
        return new NodeDrawer("---");
    }

    public static void mergeUnits(Sense src, Sense dst) {
        if (src == null || dst == null || src.getId() == -1 || dst.getId() == -1) {
            return;
        }

        throw new RuntimeException("//TODO: FIXME"); // TODO: FIXME
//		src = RemoteUtils.commonRemote.dbGet(Sense.class, src.getId());
//		dst = RemoteUtils.commonRemote.dbGet(Sense.class, dst.getId());
//
//		for (SenseRelation rel : RemoteUtils.lexicalRelationRemote.dbGetUpperRelations(src, null)) {
//
//			RemoteUtils.commonRemote.dbDelete(rel);
//
//			rel.setSenseTo(dst);
//
//			if (!RemoteUtils.lexicalRelationRemote.dbRelationExists(rel.getSenseFrom(), rel.getSenseTo(), rel.getRelation()) &&
//					!(rel.getSenseTo().equals(rel.getSenseFrom())) )
//			{
//				RemoteUtils.lexicalRelationRemote.dbMakeRelation(
//						rel.getSenseFrom(),
//						rel.getSenseTo(),
//						rel.getRelation());
//			}
//		}
//
//		for (SenseRelation rel : RemoteUtils.lexicalRelationRemote.dbGetSubRelations(src, null)) {
//
//			RemoteUtils.commonRemote.dbDelete(rel);
//
//			rel.setSenseFrom(dst);
//
//			if (!RemoteUtils.lexicalRelationRemote.dbRelationExists(rel.getSenseFrom(), rel.getSenseTo(), rel.getRelation())
//					&& !(rel.getSenseTo().equals(rel.getSenseFrom() )))
//			{
//				RemoteUtils.lexicalRelationRemote.dbMakeRelation(
//						rel.getSenseFrom(),
//						rel.getSenseTo(),
//						rel.getRelation());
//			}
//		}
//
//		String old_comment = Common.getSenseAttribute(dst, Sense.COMMENT);
//		String src_comment = Common.getSenseAttribute(src, Sense.COMMENT);
//
//		if (old_comment.isEmpty())
//			Common.addSenseAttribute(dst, Sense.COMMENT, src_comment);
//		else if (!src_comment.isEmpty()) {
//			Common.addSenseAttribute(dst, Sense.COMMENT, old_comment + "; " + src_comment);
//		}
//
//		RemoteUtils.lexicalUnitRemote.updateSense(dst);
//		RemoteUtils.lexicalUnitRemote.dbDelete(src);
    }

    public static void mergeSynsets(Synset src, Synset dst, List<Long> lexicons) {
        if (src == null || dst == null || src.getId() == -1 || dst.getId() == -1) {
            return;
        }

        for (SynsetRelation rel : RemoteUtils.synsetRelationRemote.dbGetUpperRelations(src, null, LexiconManager.getInstance().getLexicons())) {

            RemoteUtils.synsetRelationRemote.dbDelete(rel);

            rel.setSynsetTo(dst);

            if (!RelationsDA.checkIfRelationExists(rel.getSynsetFrom(), rel.getSynsetTo(), rel.getRelation())
                    && !(rel.getSynsetTo().equals(rel.getSynsetFrom()))) {
                RemoteUtils.synsetRelationRemote.dbMakeRelation(
                        rel.getSynsetFrom(),
                        rel.getSynsetTo(),
                        rel.getRelation());
            }
        }

        for (SynsetRelation rel : RemoteUtils.synsetRelationRemote.dbGetSubRelations(src, null, LexiconManager.getInstance().getLexicons())) {

            RemoteUtils.synsetRelationRemote.dbDelete(rel);

            rel.setSynsetFrom(dst);

            if (!RelationsDA.checkIfRelationExists(rel.getSynsetFrom(), rel.getSynsetTo(), rel.getRelation())
                    && !(rel.getSynsetTo().equals(rel.getSynsetFrom()))) {
                RemoteUtils.synsetRelationRemote.dbMakeRelation(
                        rel.getSynsetFrom(),
                        rel.getSynsetTo(),
                        rel.getRelation());
            }
        }

        String old_comment = Common.getSynsetAttribute(dst, Synset.COMMENT);
        if (old_comment == null) {
            old_comment = "";
        }
        String src_comment = Common.getSynsetAttribute(src, Synset.COMMENT);
        if (src_comment == null) {
            src_comment = "";
        }

        if (old_comment.isEmpty()) //			Common.addSynsetAttribute(dst, Synset.COMMENT, src_comment);
        {
            RemoteUtils.dynamicAttributesRemote.saveOrUpdateSynsetAttribute(dst, Synset.COMMENT, src_comment);
        } else if (!src_comment.isEmpty()) //			Common.addSynsetAttribute(dst, Synset.COMMENT, old_comment + "; " + src_comment);
        {
            RemoteUtils.dynamicAttributesRemote.saveOrUpdateSynsetAttribute(dst, Synset.COMMENT, old_comment + "; " + src_comment);
        }

        RemoteUtils.synsetRemote.updateSynset(dst);

        HashMap<String, Sense> dst_lemma_to_str = new HashMap<String, Sense>();
        for (Sense unit : RelationsDA.getUnits(dst, lexicons)) {
            dst_lemma_to_str.put(unit.getLemma().getWord(), unit);
        }

        ArrayList<Sense> units_to_move = new ArrayList<Sense>();

        for (Sense unit_src : RelationsDA.getUnits(src, lexicons)) {
            Sense unit_dst = dst_lemma_to_str.get(unit_src.getLemma());
            if (unit_dst == null) {
                units_to_move.add(unit_src);
            } else {
                mergeUnits(unit_src, unit_dst);
            }
        }

        RelationsDA.moveUnitsToExistenSynset(src, units_to_move, dst);
        RemoteUtils.synsetRemote.dbDelete(src);
    }

    /**
     * odczytanie domeny jednostki z bazy danych
     *
     * @param unit - jednostka
     * @return domena
     */
    public static Domain getDomain(Sense unit) {
        RemoteUtils.lexicalUnitRemote.dbGet(unit.getId());
        return unit.getDomain();
    }

    public static Synset refreshSynset(Synset synset) {
        return RemoteUtils.synsetRemote.dbGet(synset.getId());
    }
}